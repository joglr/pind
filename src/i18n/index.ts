type Strings = {
  confirmDelete: string;
};

type Locale = "da-DK";

export function S(key: keyof Strings) {
  const locale = "da-DK";
  return strings[locale][key];
}

const da_DK: Strings = {
  confirmDelete: `Er du sikker på du vil slette projektet permanent?

  Dette kan IKKE fortrydes`,
};

const strings: Record<Locale, Strings> = {
  "da-DK": da_DK,
};
