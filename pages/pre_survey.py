import streamlit as st

from content.survey_items import PRE_SURVEY
from utils import db
from utils.session import go_to_stage, reset_scenario_state
from utils.theme import close_card, likert_block, open_card, page_header


def render() -> None:
    page_header(
        "A Few Questions About You",
        "There are no right or wrong answers.",
    )

    open_card()
    age = st.text_input("What is your age?")
    gender = st.selectbox(
        "What is your gender?",
        ["Female", "Male", "Non-binary", "Prefer not to say", "Other"],
        index=None,
        placeholder="Select an option…",
    )
    prior_ai_use = st.selectbox(
        "How often have you used AI chatbots (e.g., ChatGPT, Claude) for personal or emotional topics?",
        ["Never", "Rarely", "Sometimes", "Often", "Very often"],
        index=None,
        placeholder="Select an option…",
    )

    st.divider()
    st.subheader("Social support")
    ss = likert_block(PRE_SURVEY["social_support"], ["ss_1", "ss_2", "ss_3"], "pre")

    st.divider()
    st.subheader("AI use")
    ai_vals = likert_block(PRE_SURVEY["ai_reliance"], ["ai_1", "ai_2", "ai_3"], "pre")

    st.divider()
    st.subheader("Comfort disclosing")
    dc = likert_block(PRE_SURVEY["disclosure_comfort"], ["dc_1", "dc_2", "dc_3"], "pre")

    if st.button("Continue to scenarios", type="primary"):
        if not age.strip():
            st.error("Please enter your age.")
            return
        if not gender:
            st.error("Please select your gender.")
            return
        if not prior_ai_use:
            st.error("Please answer how often you use AI chatbots.")
            return

        likert_values = {**ss, **ai_vals, **dc}
        if any(v is None for v in likert_values.values()):
            st.error("Please answer all survey items.")
            return

        payload = {
            "age": age.strip(),
            "gender": gender,
            "prior_ai_use": prior_ai_use,
            **likert_values,
            "stage": "scenario_chat",
            "current_scenario_index": 0,
        }
        db.save_pre_survey(st.session_state["participant_id"], payload)
        reset_scenario_state()
        go_to_stage("scenario_chat")
        st.rerun()
    close_card()
