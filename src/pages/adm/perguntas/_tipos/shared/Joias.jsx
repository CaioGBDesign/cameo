import JoiaRosaIcon from "@/components/icons/JoiaRosaIcon";
import JoiaAzulIcon from "@/components/icons/JoiaAzulIcon";
import JoiaAmarelaIcon from "@/components/icons/JoiaAmarelaIcon";
import JoiaVaziaIcon from "@/components/icons/JoiaVaziaIcon";

export default function Joias({ dificuldade }) {
  if (dificuldade === "1") return [<JoiaRosaIcon key="a" />, <JoiaVaziaIcon key="b" />, <JoiaVaziaIcon key="c" />];
  if (dificuldade === "2") return [<JoiaAmarelaIcon key="a" />, <JoiaAmarelaIcon key="b" />, <JoiaVaziaIcon key="c" />];
  if (dificuldade === "3") return [<JoiaAzulIcon key="a" />, <JoiaAzulIcon key="b" />, <JoiaAzulIcon key="c" />];
  return [<JoiaVaziaIcon key="a" />, <JoiaVaziaIcon key="b" />, <JoiaVaziaIcon key="c" />];
}
