import streamlit as st
from postgrest.exceptions import APIError

from content.access_codes import VALID_CODES
from utils import db
from utils.latin_square import get_assignment
from utils.session import go_to_stage
from utils.theme import close_card, open_card, page_header


def render() -> None:
    page_header(
        "Welcome",
        "Thank you for participating in this research study.",
    )

    open_card()
    access_code = st.text_input("Access code")
    if st.button("Begin", type="primary"):
        code = access_code.strip().upper()
        if code not in VALID_CODES:
            st.error("Invalid access code. Please try again.")
            return

        try:
            count = db.get_participant_count()
            row = count % 4
            assignment = get_assignment(row)

            participant_id = db.create_participant(
                access_code=code,
                latin_square_row=row,
                scenario_order=assignment["scenarios"],
                condition_order=assignment["conditions"],
            )
        except APIError as exc:
            if "row-level security" in str(exc).lower():
                st.error(
                    "Database permission error (RLS). Run the full `schema.sql` "
                    "in your Supabase SQL editor, then try again."
                )
            else:
                st.error(f"Database error: {exc}")
            return
        except Exception as exc:
            st.error(f"Could not start session: {exc}")
            return

        st.session_state["participant_id"] = participant_id
        st.session_state["scenario_order"] = assignment["scenarios"]
        st.session_state["condition_order"] = assignment["conditions"]
        st.session_state["scenario_index"] = 0
        go_to_stage("consent")
        st.rerun()
    close_card()
