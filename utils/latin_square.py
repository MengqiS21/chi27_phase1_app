LATIN_SQUARE = [
    {
        "conditions": ["A", "B", "C", "D"],
        "scenarios": ["temporal", "relational", "face", "grief"],
    },
    {
        "conditions": ["B", "C", "D", "A"],
        "scenarios": ["relational", "face", "grief", "temporal"],
    },
    {
        "conditions": ["C", "D", "A", "B"],
        "scenarios": ["face", "grief", "temporal", "relational"],
    },
    {
        "conditions": ["D", "A", "B", "C"],
        "scenarios": ["grief", "temporal", "relational", "face"],
    },
]


def get_assignment(row: int) -> dict:
    return LATIN_SQUARE[row % 4]
