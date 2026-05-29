import streamlit as st


def init_session_state() -> None:
    defaults = {
        "participant_id": None,
        "stage": "landing",
        "scenario_index": 0,
        "scenario_order": [],
        "condition_order": [],
        "messages": [],
        "turn_count": 0,
        "refusal_delivered": False,
    }
    for key, value in defaults.items():
        if key not in st.session_state:
            st.session_state[key] = value


def reset_scenario_state() -> None:
    st.session_state["messages"] = []
    st.session_state["turn_count"] = 0
    st.session_state["refusal_delivered"] = False


def current_scenario_type() -> str:
    idx = st.session_state["scenario_index"]
    return st.session_state["scenario_order"][idx]


def current_condition() -> str:
    idx = st.session_state["scenario_index"]
    return st.session_state["condition_order"][idx]


def go_to_stage(stage: str) -> None:
    st.session_state["stage"] = stage
