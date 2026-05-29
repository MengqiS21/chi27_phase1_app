import streamlit as st

from utils.theme import close_card, open_card, page_header


def render() -> None:
    page_header(
        "You're All Done",
        "Thank you for your time. You may close this browser window when you're ready.",
    )

    open_card()
    st.markdown(
        """
If you have questions about this research, please contact the study team at
**[researcher email]**.
"""
    )
    close_card()
