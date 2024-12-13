import React from 'react';

const SubjectFilter = ({ subjects, selectedSubjects, onSubjectChange }) => (
  <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
    <h3 className="text-sm font-medium text-gray-700 mb-2">Filter by Subjects</h3>
    <div className="flex flex-wrap gap-2">
      {subjects.map((subject) => (
        <label key={subject} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedSubjects.includes(subject)}
            onChange={() => onSubjectChange(subject)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">{subject}</span>
        </label>
      ))}
    </div>
  </div>
);

export default SubjectFilter;