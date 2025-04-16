import { internalWebSocketStore } from "@/plugins/_core/global-stores/web-socket";
import { ENDPOINTS } from "@/services/pplx-api/endpoints";

export async function saveSettingViaFetch(settings: Record<string, unknown>) {
  const resp = await fetch(ENDPOINTS.SAVE_SETTINGS, {
    method: "PUT",
    body: JSON.stringify({
      updated_settings: settings,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return resp.ok;
}

export async function saveSettingViaWebSocket(
  settings: Record<string, unknown>,
) {
  try {
    await internalWebSocketStore
      .getState()
      .common?.emitWithAck("save_user_settings", settings);
    return true;
  } catch (e) {
    alert("Failed to save setting");
    return false;
  }
}
