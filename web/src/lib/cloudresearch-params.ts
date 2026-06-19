export type CloudResearchCapture = {
  cloudresearch_participant_id: string | null;
  cloudresearch_assignment_id: string | null;
  cloudresearch_hit_id: string | null;
  url_query_raw: string;
};

function paramValue(params: URLSearchParams, name: string): string | null {
  const value = params.get(name)?.trim();
  return value || null;
}

function optionalString(value: unknown): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed || null;
}

export function captureCloudResearchParams(search: string): CloudResearchCapture {
  const params = new URLSearchParams(search);

  return {
    cloudresearch_participant_id:
      paramValue(params, "participantId") ??
      paramValue(params, "workerId") ??
      paramValue(params, "pid"),
    cloudresearch_assignment_id: paramValue(params, "assignmentId"),
    cloudresearch_hit_id: paramValue(params, "hitId"),
    url_query_raw: search,
  };
}

export function cloudResearchInsertFields(body: Record<string, unknown>) {
  const cloudresearch_participant_id = optionalString(
    body.cloudresearch_participant_id
  );
  const cloudresearch_assignment_id = optionalString(
    body.cloudresearch_assignment_id
  );
  const cloudresearch_hit_id = optionalString(body.cloudresearch_hit_id);
  const url_query_raw = optionalString(body.url_query_raw);

  return {
    ...(cloudresearch_participant_id
      ? { cloudresearch_participant_id }
      : {}),
    ...(cloudresearch_assignment_id
      ? { cloudresearch_assignment_id }
      : {}),
    ...(cloudresearch_hit_id ? { cloudresearch_hit_id } : {}),
    ...(url_query_raw ? { url_query_raw } : {}),
  };
}
