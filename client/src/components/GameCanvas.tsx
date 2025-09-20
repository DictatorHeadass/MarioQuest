import { forwardRef } from "react";

const GameCanvas = forwardRef<HTMLCanvasElement>((props, ref) => {
  return (
    <canvas
      ref={ref}
      width={800}
      height={600}
      style={{
        display: 'block',
        margin: '0 auto',
        background: '#5C94FC',
        border: '2px solid #333'
      }}
      {...props}
    />
  );
});

GameCanvas.displayName = 'GameCanvas';

export default GameCanvas;
