import streamlit as st

from content.survey_items import POST_SURVEY
from utils import db
from utils.session import (
    current_condition,
    current_scenario_type,
    go_to_stage,
    reset_scenario_state,
)
from utils.theme import close_card, likert_block, open_card, page_header, scenario_progress


def render() -> None:
    idx = st.session_state["scenario_index"]
    scenario_progress(idx)

    page_header(
        "Your Thoughts",
        "Please rate how much you agree with each statement based on the conversation you just had.",
    )

    open_card()
    prefix = f"post_{idx}"
    dg = likert_block(
        POST_SURVEY["goal_disengagement"],
        ["dg_1", "dg_2", "dg_3", "dg_4"],
        prefix,
    )

    st.divider()
    st.subheader("What you would do next")
    bi = likert_block(
        POST_SURVEY["behavioral_intention"],
        ["bi_follow", "bi_retry", "bi_switch", "bi_alone"],
        prefix,
    )

    st.divider()
    st.subheader("How the interaction felt")
    med = likert_block(
        POST_SURVEY["mediators"],
        ["med_understanding", "med_agency", "med_refusal"],
        prefix,
    )

    if st.button("Submit", type="primary"):
        all_values = {**dg, **bi, **med}
        if any(v is None for v in all_values.values()):
            st.error("Please answer all items before continuing.")
            return

        participant_id = st.session_state["participant_id"]
        scenario_index = idx
        scenario_type = current_scenario_type()
        condition = current_condition()

        db.save_scenario_response(
            participant_id,
            scenario_index,
            scenario_type,
            condition,
            all_values,
        )

        next_index = idx + 1
        st.session_state["scenario_index"] = next_index

        if next_index < 4:
            reset_scenario_state()
            db.update_stage(
                participant_id,
                "scenario_chat",
                scenario_index=next_index,
            )
            go_to_stage("scenario_chat")
        else:
            db.mark_complete(participant_id)
            go_to_stage("debrief")

        st.rerun()
    close_card()
