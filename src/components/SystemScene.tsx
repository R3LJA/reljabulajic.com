import LaunchPilotScene from "./scenes/LaunchPilotScene";
import DeepLeadScene from "./scenes/DeepLeadScene";
import PayControlScene from "./scenes/PayControlScene";
import VoiceVaultScene from "./scenes/VoiceVaultScene";
import SupportAgentScene from "./scenes/SupportAgentScene";
import { SceneShell, type SceneProps } from "./scenes/primitives";

/**
 * Choreographed live-demo scenes for the flagship AI systems. Each one loops
 * through the real system's story: inputs arriving, decisions being made,
 * failures being recovered, humans being pulled in at the right moment.
 */
export default function SystemScene(props: SceneProps) {
  switch (props.slug) {
    case "launchpilot":
      return <LaunchPilotScene {...props} />;
    case "deeplead":
      return <DeepLeadScene {...props} />;
    case "paycontrol":
      return <PayControlScene {...props} />;
    case "voicevault":
      return <VoiceVaultScene {...props} />;
    case "supportagent":
      return <SupportAgentScene {...props} />;
    default:
      return (
        <SceneShell accent={props.accent} name={props.slug}>
          <div />
        </SceneShell>
      );
  }
}
