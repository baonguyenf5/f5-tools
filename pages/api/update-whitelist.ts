import {
  getCloudflareDNSRecord,
  updateCloudflareDNSRecord,
} from "@/app/actions";
import { CloudflareDNSRecord } from "@/lib/types/types";
import { getF5RecordName } from "@/utils/cloudflare";
import { createClient } from "@/utils/supabase/api";
import { getUserMapping } from "@/utils/supabase/user";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const supabase = createClient(req, res);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userMapping = await getUserMapping(supabase, user?.email);
  if (!userMapping) {
    return res.status(404).json({ error: "User mapping not found" });
  }

  const dns = await getCloudflareDNSRecord(getF5RecordName(userMapping.a_name));
  if (!dns) {
    return res.status(404).json({ error: "DNS record not found" });
  }

  const { ip } = req.body;

  try {
    const record: CloudflareDNSRecord = {
      id: dns.id,
      type: "A",
      name: userMapping.a_name,
      content: ip,
      proxied: dns.proxied,
      comment: user?.email || "",
      ttl: 60,
    };
    console.log("Updating Record", record);

    const response = await updateCloudflareDNSRecord({
      id: dns.id,
      type: "A",
      name: userMapping.a_name,
      content: ip,
      proxied: dns.proxied,
      comment: user?.email || "",
      ttl: 60,
    });

    console.log("Updated Record", record.id);
    if (response.success) {
      return res.status(200).json(response);
    } else {
      return res.status(400).json({ success: false, errors: response.errors });
    }
  } catch (error) {
    console.error("Error updating whitelist:", error);
    return res.status(500).json({ error: (error as Error).message });
  }
}
