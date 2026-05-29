import html

import streamlit as st

THEME_CSS = """
<style>
:root {
  --bg: #FAF9F7;
  --surface: #FFFFFF;
  --text: #2D2840;
  --text-secondary: #7A7490;
  --accent: #8879B6;
  --accent-hover: #7264A8;
  --border: #E4DFEF;
  --input-border: #CAC5DC;
  --scenario-bg: #F0EDF8;
  --chat-user: #EDEAF7;
  --success: #5A7F6E;
  --error: #B85450;
  --error-bg: #FAF0EF;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-bubble-user: 16px 16px 4px 16px;
  --radius-bubble-ai: 16px 16px 16px 4px;
  --focus: #8879B6;
  --content-max: 760px;
  --chat-max: 680px;
}

.stApp {
  --primary-color: #8879B6;
  --text-color: #2D2840;
  --background-color: #FAF9F7;
  --secondary-background-color: #FFFFFF;
  background-color: var(--bg) !important;
  color: var(--text);
}

.block-container {
  max-width: var(--content-max);
  padding-top: 48px;
  padding-bottom: 64px;
  margin-left: auto;
  margin-right: auto;
}

[data-testid="stSidebar"] { display: none; }

/* Typography */
h1 {
  font-size: 1.75rem !important;
  font-weight: 700 !important;
  color: var(--text) !important;
  line-height: 1.3 !important;
  margin-bottom: 0.5rem !important;
}

h2, h3, .stSubheader {
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  color: var(--text) !important;
  line-height: 1.35 !important;
  margin-top: 1.75rem !important;
  margin-bottom: 0.5rem !important;
}

p, .stMarkdown p, label p, .stTextInput label p,
.stSelectbox label p, .stRadio label p {
  font-size: 1rem !important;
  line-height: 1.7 !important;
  color: var(--text) !important;
}

.study-lead {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin: 0 0 1.5rem 0;
  font-weight: 400;
}

.progress-label {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  display: block;
}

/* Cards */
.study-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 40px;
  margin-bottom: 1.5rem;
  box-shadow: none;
}

/* Scenario description */
.study-scenario-box {
  background: var(--scenario-bg);
  border: none;
  border-left: 3px solid var(--accent);
  border-radius: var(--radius-sm);
  padding: 20px 24px;
  margin: 0 0 1.75rem 0;
  font-size: 0.9375rem;
  font-style: italic;
  line-height: 1.7;
  color: var(--text);
}

/* Buttons */
.stButton > button {
  font-weight: 600 !important;
  font-size: 1rem !important;
  min-height: 44px !important;
  min-width: 44px;
  padding: 12px 28px !important;
  border-radius: var(--radius-sm) !important;
  box-shadow: none !important;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
}

.stButton > button[kind="primary"],
.stButton > button[data-testid="baseButton-primary"],
button[data-testid="baseButton-primary"] {
  background-color: var(--accent) !important;
  color: #FFFFFF !important;
  border: none !important;
}

.stButton > button[kind="primary"] p,
.stButton > button[data-testid="baseButton-primary"] p,
button[data-testid="baseButton-primary"] p {
  color: #FFFFFF !important;
}

.stButton > button[kind="primary"]:hover:not(:disabled),
.stButton > button[data-testid="baseButton-primary"]:hover:not(:disabled),
button[data-testid="baseButton-primary"]:hover:not(:disabled) {
  background-color: var(--accent-hover) !important;
  color: #FFFFFF !important;
}

.stButton > button[kind="secondary"] {
  background-color: transparent !important;
  color: var(--accent) !important;
  border: 1.5px solid var(--accent) !important;
}

.stButton > button[kind="secondary"]:hover:not(:disabled) {
  background-color: #EDE9F5 !important;
  color: var(--accent-hover) !important;
  border-color: var(--accent-hover) !important;
}

.stButton > button:disabled {
  background-color: var(--border) !important;
  color: var(--text-secondary) !important;
  border: none !important;
  opacity: 1 !important;
}

.stButton > button:focus-visible {
  outline: 2px solid var(--focus) !important;
  outline-offset: 2px !important;
}

/* Inputs */
.stTextInput input,
.stTextArea textarea,
.stChatInput textarea,
.stSelectbox [data-baseweb="select"] > div {
  background: var(--surface) !important;
  border: 1.5px solid var(--input-border) !important;
  border-radius: var(--radius-sm) !important;
  padding: 12px 16px !important;
  font-size: 1rem !important;
  color: var(--text) !important;
  min-height: 44px;
}

.stTextInput input:focus,
.stTextArea textarea:focus,
.stChatInput textarea:focus {
  border-color: var(--accent) !important;
  box-shadow: 0 0 0 3px rgba(136, 121, 182, 0.15) !important;
  outline: none !important;
}

.input-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.35rem;
  display: block;
}

/* Checkbox */
.stCheckbox label span {
  font-size: 1rem !important;
  line-height: 1.7 !important;
  color: var(--text) !important;
}

.stCheckbox input:checked + div {
  background-color: var(--accent) !important;
  border-color: var(--accent) !important;
}

/* Progress */
.stProgress > div > div {
  background-color: var(--border) !important;
  border-radius: 3px !important;
  height: 6px !important;
}

.stProgress > div > div > div,
.stProgress > div > div > div > div {
  background-color: var(--accent) !important;
  border-radius: 3px !important;
  height: 6px !important;
}

/* Likert rows */
.likert-item {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border);
}

.likert-item:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.likert-statement {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text);
  margin: 0 0 0.75rem 0;
  font-weight: 500;
}

.likert-scale-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.likert-scale-labels span {
  max-width: 42%;
}

div[data-testid="stRadio"] > div[role="radiogroup"] {
  display: flex !important;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  width: 100%;
}

div[data-testid="stRadio"] label {
  min-width: 44px;
  min-height: 44px;
  display: flex !important;
  align-items: center;
  justify-content: center;
  margin-right: 0 !important;
  padding: 0.5rem !important;
  border-radius: 50% !important;
  border: 2px solid var(--input-border) !important;
  background: var(--surface) !important;
}

div[data-testid="stRadio"] label[data-checked="true"],
div[data-testid="stRadio"] label:has(input:checked) {
  background-color: var(--accent) !important;
  border-color: var(--accent) !important;
  color: #FFFFFF !important;
  font-weight: 700 !important;
}

div[data-testid="stRadio"] label p {
  font-size: 0.9375rem !important;
  font-weight: 600 !important;
  color: inherit !important;
  margin: 0 !important;
}

div[data-testid="stRadio"] label:has(input:checked) p {
  color: #FFFFFF !important;
}

div[data-testid="stRadio"] > label {
  display: none !important;
}

/* Chat thread */
.chat-thread {
  max-width: var(--chat-max);
  margin: 0 auto 1.25rem auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chat-message-wrap {
  display: flex;
  flex-direction: column;
  max-width: 85%;
}

.chat-message-wrap.chat-user {
  align-self: flex-end;
  align-items: flex-end;
}

.chat-message-wrap.chat-assistant {
  align-self: flex-start;
  align-items: flex-start;
}

.chat-role-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 0.35rem 0;
}

.chat-bubble {
  padding: 12px 16px;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text);
  white-space: pre-wrap;
  word-wrap: break-word;
}

.chat-user .chat-bubble {
  background: var(--chat-user);
  border-radius: var(--radius-bubble-user);
  border: none;
}

.chat-assistant .chat-bubble {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-bubble-ai);
}

.chat-panel-label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.25rem 0;
}

.chat-panel-hint {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  line-height: 1.6;
}

/* Alerts */
[data-testid="stAlert"] {
  border-radius: var(--radius-sm) !important;
  font-size: 1rem !important;
}

div[data-testid="stAlert"]:has(svg[aria-label="Error"]) {
  background-color: var(--error-bg) !important;
  border: 1px solid var(--error) !important;
  color: var(--error) !important;
}

div[data-testid="stAlert"]:has(svg[aria-label="Error"]) * {
  color: var(--error) !important;
}

.stSpinner > div {
  border-top-color: var(--accent) !important;
}

hr, [data-testid="stDivider"] {
  border-color: var(--border) !important;
}

a {
  color: var(--accent) !important;
  font-weight: 600;
}

a:hover {
  color: var(--accent-hover) !important;
}

[data-testid="stHeader"] {
  background: transparent;
}

/* Chat messages (native st.chat_message) */
[data-testid="stChatMessage"] {
  background: transparent !important;
  border: none !important;
  padding: 0.25rem 0 !important;
  max-width: var(--chat-max);
  margin-left: auto;
  margin-right: auto;
}

[data-testid="stChatMessage"] [data-testid="stMarkdownContainer"] p {
  font-size: 1rem !important;
  line-height: 1.7 !important;
  color: var(--text) !important;
}

[data-testid="stChatMessage"] .chat-role-caption {
  font-size: 0.8125rem !important;
  font-weight: 600 !important;
  color: var(--text-secondary) !important;
  margin-bottom: 0.35rem !important;
}

[data-testid="stChatMessage"] .chat-bubble-content {
  padding: 12px 16px;
  border-radius: var(--radius-bubble-ai);
  background: var(--surface);
  border: 1px solid var(--border);
}

/* User messages — align right with tinted bubble */
[data-testid="stChatMessage"]:has([data-testid="chatAvatarIcon-user"]) {
  flex-direction: row-reverse;
}

[data-testid="stChatMessage"]:has([data-testid="chatAvatarIcon-user"]) .chat-bubble-content {
  background: var(--chat-user);
  border: none;
  border-radius: var(--radius-bubble-user);
}

/* Form element spacing */
div[data-testid="stTextInput"] {
  margin-bottom: 1.25rem;
}

div[data-testid="stSelectbox"] {
  max-width: 420px;
  margin-bottom: 1.25rem;
}

[data-testid="stDivider"] {
  margin-top: 2rem !important;
  margin-bottom: 2rem !important;
}

/* Dropdown container */
[data-baseweb="popover"] [data-baseweb="menu"] {
  border-radius: var(--radius-sm) !important;
  border: 1px solid var(--border) !important;
  box-shadow: 0 4px 16px rgba(44, 28, 64, 0.07) !important;
  overflow: hidden !important;
}

/* All dropdown items — reset to plain white */
[data-baseweb="popover"] li,
[data-baseweb="popover"] [role="option"] {
  font-size: 0.9375rem !important;
  color: var(--text) !important;
  padding: 10px 16px !important;
  background-color: var(--surface) !important;
  min-height: unset !important;
}

/* Hover state */
[data-baseweb="popover"] li:hover,
[data-baseweb="popover"] [role="option"]:hover {
  background-color: var(--scenario-bg) !important;
}

/* Selected / highlighted state — light tint, NOT solid accent */
[data-baseweb="popover"] li[aria-selected="true"],
[data-baseweb="popover"] [role="option"][aria-selected="true"],
[data-baseweb="popover"] li[data-highlighted="true"],
[data-baseweb="popover"] [role="option"][data-highlighted="true"] {
  background-color: var(--scenario-bg) !important;
  color: var(--text) !important;
  font-weight: 500 !important;
}

/* Hide the blank placeholder slot that Streamlit renders at top of list */
[data-baseweb="popover"] li:empty,
[data-baseweb="popover"] [role="option"]:empty {
  display: none !important;
}
</style>
"""


def apply_theme() -> None:
    st.markdown(THEME_CSS, unsafe_allow_html=True)


def page_header(title: str, subtitle: str | None = None) -> None:
    st.title(title)
    if subtitle:
        st.markdown(
            f'<p class="study-lead">{html.escape(subtitle)}</p>',
            unsafe_allow_html=True,
        )


def open_card() -> None:
    st.markdown('<div class="study-card">', unsafe_allow_html=True)


def close_card() -> None:
    st.markdown("</div>", unsafe_allow_html=True)


def scenario_progress(scenario_index: int, total: int = 4) -> None:
    current = scenario_index + 1
    st.markdown(
        f'<span class="progress-label">Scenario {current} of {total}</span>',
        unsafe_allow_html=True,
    )
    st.progress(current / total)


def scenario_text_block(text: str) -> None:
    safe = html.escape(text)
    st.markdown(f'<div class="study-scenario-box">{safe}</div>', unsafe_allow_html=True)


def likert_row(statement: str, key: str) -> int | None:
    st.markdown('<div class="likert-item">', unsafe_allow_html=True)
    st.markdown(
        f'<p class="likert-statement">{html.escape(statement)}</p>',
        unsafe_allow_html=True,
    )
    st.markdown(
        """
        <div class="likert-scale-labels">
          <span>1 · Strongly Disagree</span>
          <span>7 · Strongly Agree</span>
        </div>
        """,
        unsafe_allow_html=True,
    )
    value = st.radio(
        "Rate this statement",
        options=[1, 2, 3, 4, 5, 6, 7],
        index=None,
        horizontal=True,
        key=key,
        label_visibility="collapsed",
    )
    st.markdown("</div>", unsafe_allow_html=True)
    return int(value) if value is not None else None


def likert_block(items: list[str], keys: list[str], key_prefix: str) -> dict[str, int | None]:
    values: dict[str, int | None] = {}
    for item, field_key in zip(items, keys):
        widget_key = f"{key_prefix}_{field_key}"
        values[field_key] = likert_row(item, widget_key)
    return values


def render_chat_messages(messages: list[dict]) -> None:
    for msg in messages:
        role = msg["role"]
        label = "You" if role == "user" else "AI"
        with st.chat_message(role):
            st.markdown(f'<p class="chat-role-caption">{label}</p>', unsafe_allow_html=True)
            st.markdown(msg["content"])

def chat_input_label(text: str = "Your message") -> None:
    st.markdown(
        f'<label class="input-label" for="chat-input-field">{html.escape(text)}</label>',
        unsafe_allow_html=True,
    )
