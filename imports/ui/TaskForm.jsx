import React, { useState } from 'react';
export const TaskForm = ({ user }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text) return;

    Meteor.call('tasks.insert', text);
    setText('');
  };
  const [text, setText] = useState('');
  return (
    <form className='task-form' onSubmit={handleSubmit}>
      <input
        type='text'
        placeholder='Type to add new Tasks'
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type='submit'>Add Task </button>
    </form>
  );
};
