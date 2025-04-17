import { getCloudflareDNSRecord } from "@/app/actions";
import { CloudflareDNSRecord, UserMapping } from "@/lib/types/types";
import { getF5RecordName } from "@/utils/cloudflare";
import { createClient } from "@/utils/supabase/api";
import { getUserMapping } from "@/utils/supabase/user";
import { User } from "@supabase/supabase-js";
import { NextApiRequest, NextApiResponse } from "next";
import requestIp from "request-ip";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const clientIp = requestIp.getClientIp(req);

  const supabase = createClient(req, res);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let mapping: UserMapping | undefined;
  if (user?.email) {
    mapping = await getUserMapping(supabase, user.email);
  }

  let dns: CloudflareDNSRecord | undefined;
  if (mapping?.a_name) {
    dns = await getCloudflareDNSRecord(getF5RecordName(mapping.a_name));
  }

  return res.status(200).json({ clientIp, mapping: mapping, dns: dns });
}
