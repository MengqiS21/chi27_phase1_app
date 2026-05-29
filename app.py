import streamlit as st
from dotenv import load_dotenv

from pages import (
    consent,
    debrief,
    landing,
    post_survey,
    pre_survey,
    scenario_chat,
)
from utils.session import init_session_state
from utils.theme import apply_theme

load_dotenv()

st.set_page_config(
    page_title="Research Study",
    layout="centered",
    initial_sidebar_state="collapsed",
)

st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap');
    html, body, [class*="css"] { font-family: 'Nunito', sans-serif; }
    </style>
    """,
    unsafe_allow_html=True,
)

apply_theme()
init_session_state()

STAGES = {
    "landing": landing.render,
    "consent": consent.render,
    "pre_survey": pre_survey.render,
    "scenario_chat": scenario_chat.render,
    "post_survey": post_survey.render,
    "debrief": debrief.render,
}

stage = st.session_state.get("stage", "landing")
render_fn = STAGES.get(stage, landing.render)
render_fn()
