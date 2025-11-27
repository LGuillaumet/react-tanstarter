export type DiscordServerOption = {
  id: string;
  label?: string;
};

export type AppDefaults = {
  discord: {
    serverOptions: DiscordServerOption[];
  };
};

export const appDefaults: AppDefaults = {
  discord: {
    serverOptions: [
      {
        id: "482343720491155467",
      },
    ],
  },
};

export const defaultDiscordServerId = appDefaults.discord.serverOptions[0]?.id ?? "";
