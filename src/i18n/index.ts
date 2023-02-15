type Strings = {
  confirmDelete: string;
};

type Locale = "da-DK";

export function S(key: keyof Strings) {
  const locale = "da-DK";
  const localeStrings = strings[locale];
  if (!(key in localeStrings)) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(`Missing translation for key: ${key}`);
    }
    return `{{ ${key} }}`;
  }
  return localeStrings[key];
}

const da_DK: Strings = {
  confirmDelete: `Er du sikker på du vil slette projektet permanent?

  Dette kan IKKE fortrydes`,
};

const strings: Record<Locale, Strings> = {
  "da-DK": da_DK,
};
