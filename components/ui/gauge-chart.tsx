import dynamic from "next/dynamic";
const GaugeComponent = dynamic(() => import('react-gauge-component'), { ssr: false });

//Component with default values
<GaugeComponent />

export default GaugeComponent;