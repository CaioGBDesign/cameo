import React from "react";
import Badge from "@/components/badge";

const certificationMap = {
  L:  { variant: "livre",      label: "Livre"    },
  10: { variant: "dez",        label: "10 anos"  },
  12: { variant: "doze",       label: "12 anos"  },
  14: { variant: "quatorze",   label: "14 anos"  },
  16: { variant: "dezesseis",  label: "16 anos"  },
  18: { variant: "dezoito",    label: "18 anos"  },
};

const Classificacao = ({ releaseDates }) => {
  if (!releaseDates) return null;

  const brRelease = releaseDates.find((r) => r.iso_3166_1 === "BR");

  if (
    brRelease &&
    brRelease.release_dates.length > 0 &&
    brRelease.release_dates[0].certification
  ) {
    const certification = brRelease.release_dates[0].certification;
    const entry = certificationMap[certification];

    if (!entry) return null;

    return <Badge variant={entry.variant} label={entry.label} />;
  }

  return null;
};

export default Classificacao;
