import { db } from "@/lib/db";
import { activityLogs } from "@/lib/db/schema";
import { generateId } from "@/lib/utils";

type LogParams = {
  userId: string;
  userName: string;
  action: "create" | "update" | "delete" | "login" | "logout";
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
};

export async function logActivity(params: LogParams): Promise<void> {
  try {
    await db.insert(activityLogs).values({
      id: generateId(),
      userId: params.userId,
      userName: params.userName,
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId ?? null,
      details: params.details ?? null,
      ipAddress: params.ipAddress ?? null,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Activity log error:", error);
  }
}
