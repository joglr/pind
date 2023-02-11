import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-sm">
      <h1 className="my-2 text-lg font-bold">Privatlivspolitik</h1>
      <p className="my-2">
        Pind indsamler automatisk ikke nogle informationer om dig.
      </p>
      <p className="my-2">
        Pind anvender cookies, til at huske at du er logget ind. Cookies bliver
        kun brugt hvis du logger ind på siden.
      </p>
      <p className="my-2">
        Når du logger ind med via en tredjepart, giver du samtykke til at vi
        lagrer basal information om dig, som navn, email og profilbillede. Denne
        information bruges til at verificere dit login, samt til at vise dit
        profilbillede på siden.
      </p>
      <p>
        Du kan altid slette din konto, og dermed slette alle dine data fra Pind.
        Klik{" "}
        <Link className="text-purple-400" href="/your-data">
          her
        </Link>{" "}
        hvis du vil slette din konto.
      </p>
    </div>
  );
};

export default PrivacyPolicy;
