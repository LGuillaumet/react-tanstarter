import { env } from "~/env/server";
import type { DiscordGuild, DiscordGuildChannel } from "~/types";

const DISCORD_API_BASE_URL = "https://discord.com/api/v10";
const DISCORD_CDN_BASE_URL = "https://cdn.discordapp.com";

function getDiscordBotToken(): string {
  const botToken = env.DISCORD_BOT_TOKEN;

  if (!botToken) {
    throw new Error(
      "DISCORD_BOT_TOKEN n'est pas configuré. Ajoutez-le à votre fichier .env.",
    );
  }

  return botToken;
}

async function discordFetch<TResponse>(
  endpoint: string,
  { onErrorMessage }: { onErrorMessage: string },
): Promise<TResponse> {
  const token = getDiscordBotToken();
  const response = await fetch(`${DISCORD_API_BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bot ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${onErrorMessage} (${response.status}): ${errorText}`);
  }

  return (await response.json()) as TResponse;
}

type DiscordApiChannel = {
  id: string;
  name: string;
  type: number;
  parent_id: string | null;
};

function buildDiscordCdnUrl(path: string, size?: number) {
  return size
    ? `${DISCORD_CDN_BASE_URL}${path}?size=${size}`
    : `${DISCORD_CDN_BASE_URL}${path}`;
}

function resolveDiscordAssetExtension(hash: string) {
  return hash.startsWith("a_") ? "gif" : "png";
}

async function fetchDiscordGuild(guildId: string): Promise<DiscordGuild> {
  return discordFetch<DiscordGuild>(`/guilds/${guildId}`, {
    onErrorMessage: `Discord API error while fetching guild ${guildId}`,
  });
}

async function fetchDiscordGuildChannels(
  guildId: string,
): Promise<DiscordGuildChannel[]> {
  const channels = await discordFetch<DiscordApiChannel[]>(
    `/guilds/${guildId}/channels`,
    {
      onErrorMessage: `Discord API error while listing channels for guild ${guildId}`,
    },
  );

  return channels
    .filter((channel) => channel.type === 0)
    .map((channel) => ({
      id: channel.id,
      name: channel.name,
      type: channel.type,
      parentId: channel.parent_id,
    }));
}

function getDiscordUserAvatarUrl({
  userId,
  avatarId,
  size = 128,
}: {
  userId?: string | null;
  avatarId?: string | null;
  size?: number;
}): string | null {
  if (!userId || !avatarId) {
    return null;
  }

  const extension = resolveDiscordAssetExtension(avatarId);
  return buildDiscordCdnUrl(`/avatars/${userId}/${avatarId}.${extension}`, size);
}

function getDiscordServerIconUrl({
  guildId,
  iconId,
  size = 128,
}: {
  guildId?: string | null;
  iconId?: string | null;
  size?: number;
}): string | null {
  if (!guildId || !iconId) {
    return null;
  }

  const extension = resolveDiscordAssetExtension(iconId);
  return buildDiscordCdnUrl(`/icons/${guildId}/${iconId}.${extension}`, size);
}

export const discordService = {
  fetchDiscordGuild,
  fetchDiscordGuildChannels,
  getDiscordUserAvatarUrl,
  getDiscordServerIconUrl,
};
