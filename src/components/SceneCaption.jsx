import './SceneCaption.css';

export default function SceneCaption({ scene, indexLabel }) {
  return (
    <>
      <div className="scene-caption">
        <div className="scene-caption__hi">{scene.hi}</div>
        <div className="scene-caption__en">{scene.en}</div>
        <div className="scene-caption__ambient">{scene.ambient}</div>
      </div>
      <div className="scene-index">
        {indexLabel} / 06 — {scene.photoNote}
      </div>
    </>
  );
}
