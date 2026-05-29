import streamlit as st

from content.consent_text import CONSENT_TEXT
from utils import db
from utils.session import go_to_stage
from utils.theme import close_card, open_card, page_header


def render() -> None:
    page_header("Before We Begin")

    open_card()
    st.markdown(CONSENT_TEXT)
    st.divider()

    agreed = st.checkbox("I agree and wish to continue")
    if st.button("Continue", type="primary", disabled=not agreed):
        db.update_stage(st.session_state["participant_id"], "pre_survey")
        go_to_stage("pre_survey")
        st.rerun()
    close_card()
