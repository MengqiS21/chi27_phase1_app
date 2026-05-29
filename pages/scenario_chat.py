import streamlit as st

from content.scenarios import SCENARIOS
from utils import ai, db
from utils.session import (
    current_condition,
    current_scenario_type,
    go_to_stage,
)
from utils.theme import (
    chat_input_label,
    close_card,
    open_card,
    page_header,
    render_chat_messages,
    scenario_progress,
    scenario_text_block,
)


def _save_message_safe(**kwargs) -> None:
    try:
        db.save_message(**kwargs)
    except Exception as exc:
        st.warning(f"Message could not be saved to the database: {exc}")


def render() -> None:
    idx = st.session_state["scenario_index"]
    scenario_progress(idx)

    scenario_type = current_scenario_type()
    condition = current_condition()
    scenario = SCENARIOS[scenario_type]

    page_header(scenario["title"])
    scenario_text_block(scenario["text"])

    open_card()
    st.markdown('<p class="chat-panel-label">Conversation with the AI</p>', unsafe_allow_html=True)
    st.markdown(
        '<p class="chat-panel-hint">Share what you might say in this situation. '
        "The AI will respond after each message.</p>",
        unsafe_allow_html=True,
    )

    render_chat_messages(st.session_state["messages"])

    participant_id = st.session_state["participant_id"]
    scenario_index = st.session_state["scenario_index"]

    if st.session_state["refusal_delivered"]:
        if st.button("Continue to Survey →", type="primary"):
            db.update_stage(
                participant_id,
                "post_survey",
                scenario_index=scenario_index,
            )
            go_to_stage("post_survey")
            st.rerun()
        close_card()
        return

    chat_input_label()
    if user_input := st.chat_input("Type here…"):
        next_turn = st.session_state["turn_count"] + 1
        user_message = {"role": "user", "content": user_input}
        pending_messages = st.session_state["messages"] + [user_message]

        with st.spinner("AI is typing..."):
            try:
                assistant_text = ai.get_ai_response(
                    pending_messages,
                    condition,
                    scenario_type,
                    next_turn,
                )
            except Exception as exc:
                st.error(
                    f"Could not get a response from the AI. Please try again. ({exc})"
                )
                return

        if not assistant_text or not assistant_text.strip():
            st.error("The AI returned an empty response. Please try again.")
            return

        st.session_state["messages"].append(user_message)
        st.session_state["messages"].append(
            {"role": "assistant", "content": assistant_text}
        )
        st.session_state["turn_count"] = next_turn

        _save_message_safe(
            participant_id=participant_id,
            scenario_index=scenario_index,
            scenario_type=scenario_type,
            condition=condition,
            turn_index=next_turn,
            role="user",
            content=user_input,
        )
        _save_message_safe(
            participant_id=participant_id,
            scenario_index=scenario_index,
            scenario_type=scenario_type,
            condition=condition,
            turn_index=next_turn,
            role="assistant",
            content=assistant_text,
        )

        if next_turn >= 3:
            st.session_state["refusal_delivered"] = True

    close_card()
