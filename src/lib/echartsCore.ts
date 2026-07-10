// Import modular en vez de `echarts-for-react` a secas: el paquete completo
// bundlea ~20 tipos de gráfico que esta app no usa (mapas, pie, sankey...).
// Solo usamos líneas — registrar únicamente lo necesario baja el chunk
// principal de ~1.8MB a una fracción (verificado con `npm run build`).
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import { GridComponent, LegendComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([LineChart, GridComponent, LegendComponent, TooltipComponent, CanvasRenderer]);

export { echarts };
