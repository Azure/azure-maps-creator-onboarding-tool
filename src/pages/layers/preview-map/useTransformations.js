import { useEventListener } from 'hooks';
import { EVENTS } from 'hooks/useEventListener';
import { useRef, useState } from 'react';

const useTransformations = attrs => {
  const { canvasRef, drawRef } = attrs;

  const [isPanning, setIsPanning] = useState(false);
  const startPositionRef = useRef({ x: 0, y: 0 });
  const transformationsRef = useRef({ x: 0, y: 0, zoom: 1 });

  const handleMouseDown = e => {
    setIsPanning(true);
    startPositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = e => {
    if (!isPanning) return;

    const dx = e.clientX - startPositionRef.current.x;
    const dy = e.clientY - startPositionRef.current.y;

    startPositionRef.current = { x: e.clientX, y: e.clientY };

    transformationsRef.current.x += dx;
    transformationsRef.current.y += dy;

    drawRef.current();
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const zoom = (zoomDirection, x, y) => {
    // Current zoom and position
    let anchorX = x;
    let anchorY = y;

    if (!anchorX || !anchorY) {
      anchorX = canvasRef.current.width / 2;
      anchorY = canvasRef.current.height / 2;
    }

    const currentZoom = transformationsRef.current.zoom;
    const currentX = transformationsRef.current.x;
    const currentY = transformationsRef.current.y;

    // Calculate the zoom factor
    const sensitivity = currentZoom / 5;
    const newZoom = Math.max(0.1, Math.min(currentZoom + zoomDirection * sensitivity, 10));

    // Calculate how much we need to scale the translation
    const scale = newZoom / currentZoom;

    // Calculate the new translation so the mouse point is fixed
    const newPosX = anchorX - scale * (anchorX - currentX);
    const newPosY = anchorY - scale * (anchorY - currentY);

    // Update transformations
    transformationsRef.current.zoom = newZoom;
    transformationsRef.current.x = newPosX;
    transformationsRef.current.y = newPosY;

    drawRef.current();
  };

  const handleWheel = e => {
    e.preventDefault();
    // Mouse position relative to the canvas
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomDirection = e.deltaY > 0 ? -1 : 1;
    zoom(zoomDirection, mouseX, mouseY);
  };

  const reset = () => {
    transformationsRef.current.zoom = 1;
    transformationsRef.current.x = 0;
    transformationsRef.current.y = 0;
    drawRef.current();
  };

  useEventListener(handleMouseDown, EVENTS.MOUSE_DOWN, canvasRef.current);
  useEventListener(handleMouseMove, EVENTS.MOUSE_MOVE, canvasRef.current);
  useEventListener(handleMouseUp, EVENTS.MOUSE_UP, window);
  useEventListener(handleWheel, EVENTS.WHEEL, canvasRef.current);

  return {
    isPanning,
    transformations: transformationsRef.current,
    controls: {
      zoomIn: () => zoom(1),
      zoomOut: () => zoom(-1),
      reset,
    },
  };
};

export default useTransformations;
