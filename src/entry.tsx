import habitat from "preact-habitat";
import Container from './Container';

declare global {
  interface Window {
    renderWidget: () => void
  }
}

const _habitat = habitat(Container);

const rendering = () => _habitat.render({
  selector: '[data-widget-host="bc-op-widget"]'
});