import os
from datetime import datetime, timezone

from supabase import create_client


def get_client():
    return create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_KEY"])


def get_participant_count() -> int:
    client = get_client()
    result = (
        client.table("participants")
        .select("id", count="exact", head=True)
        .execute()
    )
    return result.count or 0


def create_participant(
    access_code: str,
    latin_square_row: int,
    scenario_order: list,
    condition_order: list,
) -> str:
    client = get_client()
    result = (
        client.table("participants")
        .insert(
            {
                "access_code": access_code,
                "latin_square_row": latin_square_row,
                "scenario_order": scenario_order,
                "condition_order": condition_order,
                "stage": "consent",
            }
        )
        .execute()
    )
    return result.data[0]["id"]


def update_stage(
    participant_id: str,
    stage: str,
    scenario_index: int | None = None,
) -> None:
    client = get_client()
    payload: dict = {"stage": stage}
    if scenario_index is not None:
        payload["current_scenario_index"] = scenario_index
    client.table("participants").update(payload).eq("id", participant_id).execute()


def save_pre_survey(participant_id: str, data: dict) -> None:
    client = get_client()
    client.table("participants").update(data).eq("id", participant_id).execute()


def save_message(
    participant_id: str,
    scenario_index: int,
    scenario_type: str,
    condition: str,
    turn_index: int,
    role: str,
    content: str,
) -> None:
    client = get_client()
    client.table("conversations").insert(
        {
            "participant_id": participant_id,
            "scenario_index": scenario_index,
            "scenario_type": scenario_type,
            "condition": condition,
            "turn_index": turn_index,
            "role": role,
            "content": content,
        }
    ).execute()


def save_scenario_response(
    participant_id: str,
    scenario_index: int,
    scenario_type: str,
    condition: str,
    data: dict,
) -> None:
    client = get_client()
    client.table("scenario_responses").insert(
        {
            "participant_id": participant_id,
            "scenario_index": scenario_index,
            "scenario_type": scenario_type,
            "condition": condition,
            **data,
        }
    ).execute()


def mark_complete(participant_id: str) -> None:
    client = get_client()
    client.table("participants").update(
        {
            "stage": "debrief",
            "completed_at": datetime.now(timezone.utc).isoformat(),
        }
    ).eq("id", participant_id).execute()
