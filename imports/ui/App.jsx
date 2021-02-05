import React, { useState, Fragment } from 'react';
import { Task } from './Task.jsx';
import { useTracker } from 'meteor/react-meteor-data';
import { TasksCollection } from '/imports/db/TasksCollection';
import { TaskForm } from './TaskForm.jsx';
import { LoginForm } from './LoginForm';

export const App = () => {
  const user = useTracker(() => Meteor.user());
  console.log('....user in app.js....', user);
  const hideCompletedFilter = { isChecked: { $ne: true } };
  const userFilter = user ? { userId: user._id } : {};
  const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  const [hideCompleted, setHideCompleted] = useState(false);

  const toggleChecked = ({ _id, isChecked }) => {
    Meteor.call('tasks.setIsChecked', _id, !isChecked);
  };

  const deleteTask = ({ _id }) => {
    Meteor.call('tasks.remove', _id);
  };

  //To get all pending tasks, actual tasks and loading state when subscription is not ready
  const { tasks, pendingTasksCount, isLoading } = useTracker(() => {
    const noDataAvailable = { tasks: [], pendingTasksCount: 0 };
    if (!Meteor.user()) {
      return noDataAvailable;
    }
    const handler = Meteor.subscribe('tasks');

    if (!handler.ready()) {
      return { ...noDataAvailable, isLoading: true };
    }

    const tasks = TasksCollection.find(
      hideCompleted ? pendingOnlyFilter : userFilter,
      {
        sort: { createdAt: -1 }
      }
    ).fetch();
    const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();

    return { tasks, pendingTasksCount };
  });

  const pendingTasksTitle = `${
    pendingTasksCount ? ` (${pendingTasksCount})` : ''
  }`;

  const logout = () => Meteor.logout();

  console.log(TasksCollection.find({}, { sort: { createdAt: -1 } }).fetch());
  return (
    <div className='app'>
      <header>
        <div className='app-bar'>
          <div className='app-header'>
            <h1>Welcome to Meteor!</h1>
            <h1>
              📝️ To Do List
              {pendingTasksTitle}
            </h1>
          </div>
        </div>
      </header>
      <div className='main'>
        {user ? (
          <Fragment>
            <div className='user' onClick={logout}>
              {user.username} 🚪
            </div>
            <TaskForm />
            <div className='filter'>
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? 'Show All' : 'Hide Completed'}
              </button>
            </div>
            {isLoading && <div className='loading'>loading...</div>}
            <ul className='tasks'>
              {tasks.map((task) => (
                <Task
                  key={task._id}
                  task={task}
                  onCheckBoxClick={toggleChecked}
                  onDeleteClick={deleteTask}
                />
              ))}
            </ul>
          </Fragment>
        ) : (
          <LoginForm />
        )}
      </div>
    </div>
  );
};
