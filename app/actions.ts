"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CloudflareDNSRecord } from "@/lib/types/types";

export const signInWithAzure = async () => {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "azure",
    options: {
      scopes: "email",
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect(data.url);
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const getCloudflareDNSRecord = async (name: string) => {
  const cloudFlareZoneId = process.env.CLOUDFLARE_ZONE_ID;
  const cloudFlareApiKey = process.env.CLOUDFLARE_API_TOKEN;

  const cloudflareResponse = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${cloudFlareZoneId}/dns_records?name.exact=${name}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cloudFlareApiKey}`,
        "Content-Type": "application/json",
      },
    }
  );
  if (!cloudflareResponse.ok) {
    throw new Error("Error fetching Cloudflare data");
  }
  const cloudflareData = await cloudflareResponse.json();

  return cloudflareData.result[0] as CloudflareDNSRecord | undefined;
};

export const updateCloudflareDNSRecord = async (
  record: CloudflareDNSRecord
) => {
  const cloudFlareZoneId = process.env.CLOUDFLARE_ZONE_ID;
  const cloudFlareApiKey = process.env.CLOUDFLARE_API_TOKEN;

  const cloudflareResponse = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${cloudFlareZoneId}/dns_records/${record.id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${cloudFlareApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: record.type,
        name: record.name,
        content: record.content,
        proxied: record.proxied,
        ttl: record.ttl,
        comment: record.comment,
      }),
    }
  );

  if (!cloudflareResponse.ok) {
    const errorData = await cloudflareResponse.json();
    throw new Error(errorData.errors?.[0]?.message || "Unknown error");
  }

  return cloudflareResponse.json();
};
