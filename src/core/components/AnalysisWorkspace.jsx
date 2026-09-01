import FeatureCard from "../features/FeatureCard.jsx";
import { featuresForLesson, lessonCatalog } from "../data/lessonCatalog.js";

function MissingFeature({ lesson, featureId }) {
  return (
    <article className="missing-feature">
      <p className="eyebrow">Student capability not installed</p>
      <h3>{featureId}</h3>
      <p>
        Complete the physics specification, generate the three student-owned files,
        and use this exact feature ID. The analysis will appear here automatically.
      </p>
      <code>src/student/features/{featureId}.feature.js</code>
      <p className="missing-purpose">Engineering purpose: {lesson.description}</p>
    </article>
  );
}

export default function AnalysisWorkspace({ aircraft, features, selectedLessonId, onLessonChange }) {
  const selectedLesson = lessonCatalog.find((lesson) => lesson.id === selectedLessonId) ?? lessonCatalog[0];
  const lessonFeatures = featuresForLesson(features, selectedLesson);
  const missingIds = selectedLesson.featureIds.filter(
    (id) => !lessonFeatures.some((feature) => feature.id === id),
  );

  return (
    <section className="analysis-area" aria-labelledby="analysis-title">
      <div className="section-heading">
        <p className="eyebrow">Stability teaching sequence</p>
        <h2 id="analysis-title">Analysis workspace</h2>
      </div>

      <div className="lesson-tabs" role="tablist" aria-label="Course analysis blocks">
        {lessonCatalog.map((lesson) => (
          <button
            className={lesson.id === selectedLesson.id ? "active" : ""}
            key={lesson.id}
            onClick={() => onLessonChange(lesson.id)}
            role="tab"
            aria-selected={lesson.id === selectedLesson.id}
          >
            {lesson.shortTitle}
          </button>
        ))}
      </div>

      <header className="lesson-intro">
        <p className="eyebrow">Current block</p>
        <h3>{selectedLesson.title}</h3>
        <p>{selectedLesson.description}</p>
      </header>

      <div className="lesson-features">
        {lessonFeatures.map((feature, index) => (
          <FeatureCard
            key={feature.id}
            feature={feature}
            aircraft={aircraft}
            sequence={index + 1}
          />
        ))}
        {missingIds.map((featureId) => (
          <MissingFeature key={featureId} lesson={selectedLesson} featureId={featureId} />
        ))}
        {lessonFeatures.length === 0 && missingIds.length === 0 && (
          <p className="empty-lesson">No foundation features are currently installed.</p>
        )}
      </div>
    </section>
  );
}
