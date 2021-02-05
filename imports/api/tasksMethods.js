import { check } from 'meteor/check';
import { TasksCollection } from '/imports/db/TasksCollection';

Meteor.methods({
  'tasks.insert'(text) {
    //Type checking
    check(text, String);

    //To check if user is authenticated
    if (!this.userId) {
      throw new Meteor.Error('Not authorized');
    }

    TasksCollection.insert({
      text,
      createdAt: new Date(),
      userId: this.userId
    });
  },

  'tasks.remove'(taskId) {
    check(taskId, String);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized');
    }

    //To check if same user is modifying the task who had created it
    const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });
    if (!task) throw new Meteor.Error('Access Denied');

    TasksCollection.remove(taskId);
  },

  'tasks.setIsChecked'(taskId, isChecked) {
    check(taskId, String);
    check(isChecked, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('Not authorized');
    }

    //To check if same user is modifying the task who had created it
    const task = TasksCollection.findOne({ _id: taskId, userId: this.userId });
    if (!task) throw new Meteor.Error('Access Denied');

    TasksCollection.update(taskId, {
      $set: {
        isChecked
      }
    });
  }
});
