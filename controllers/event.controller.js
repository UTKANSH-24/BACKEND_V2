// import fs from 'fs/promises';
// import path from 'path';
// import cloudinary from 'cloudinary';
// import asyncHandler from '../middlewares/asyncHandler.middleware.js';
// import Event from '../models/events.model.js';
// import AppError from '../utils/AppError.js';
// import sendEmail from '../utils/sendEmail.js';
// import User from '../models/user.model.js';
// import mongoose from 'mongoose';


// export const getAllEvents = asyncHandler(async (req, res, next) => {

//   const user = req.user;
//   // console.log(user);

//   try {
//     let events;

//     if (user.role === 'USER') {
//       events = await Event.find({
//         'teams': {
//           $elemMatch: { registeredBy: user.id }
//         }
//       });
//     } else if (user.role === 'ADMIN') {
//       events = await Event.find({});
//     } else {
//       return next(new AppError('Unauthorized access', 403));
//     }

//     res.status(200).json({
//       success: true,
//       message: 'All Events',
//       events,
//     });
//   } catch (error) {
//     console.error(error);
//     return next(new AppError('Error access', 503));
//   }
// });



// export const createEvent = asyncHandler(async (req, res, next) => {
//   const {
//     title,
//     description,
//     club,
//     minimumTeamLength,
//     maximumTeamLength,
//   } = req.body.userInput;
//   // console.log(req.body);
//   const user = req.user;
//   // console.log(user);
//   // console.log(title, description, club, minimumTeamLength, maximumTeamLength);

//   if (!title || !description || !club || !(user.id) || !minimumTeamLength || !maximumTeamLength) {
//     return next(new AppError('All fields are required', 400));
//   }
//   const event = await Event.create({
//     title,
//     description,
//     club,
//     createdBy: user.id,
//     minimumTeamLength,
//     maximumTeamLength
//   });
//   console.log('sf');
//   if (!event) {
//     console.log('nope');
//     return next(new AppError('Event could not be created, please try again', 400));
//   }
//   res.status(201).json({
//     success: true,
//     message: 'Event created successfully',
//     // event,
//   });

// });


// export const getParticipantsByEventId = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { verified } = req.query;
//   const user = req.user;
//   console.log("user");
//   console.log(user);

//   try {
//     const event = await Event.findById(id);

//     if (!event) {
//       return res.status(404).json({ success: false, message: 'Event not found' });
//     }

//     let teams = [];

//     if (verified === 'true') {
//       teams = event.teams.filter(team => team.paymentVerified === true);
//     } else if (verified === 'false') {
//       teams = event.teams.filter(team => team.paymentVerified === false);
//     } else {
//       teams = event.teams;
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Event teams detail fetched successfully',
//       teams: teams,
//     });
//   } catch (error) {
//     next(new AppError('Internal Server Error', 500));
//   }
// });

// export const getFacultyCoordinatorsByEventId = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const event = await Event.findById(id);

//   if (!event) {
//     return next(new AppError('Invalid Event id or Event not found.', 408));
//   }

//   if (event.facultyCoordinators?.length === 0) {
//     return next(new AppError('No faculty is assigned to this event.', 404));
//   }

//   res.status(200).json({
//     success: true,
//     message: 'Event participants fetched successfully',
//     facultyCoordinators: event.facultyCoordinators,
//   });
// });

// export const getTcaCoordinatorByEventId = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const event = await Event.findById(id);

//   if (!event) {
//     return next(new AppError('Invalid Event id or Event not found.', 408));
//   }
//   if (event.tcaCoordinators?.length === 0) {
//     return next(new AppError('No coordinator assigned.', 404));
//   }

//   res.status(200).json({
//     success: true,
//     message: 'Event participants fetched successfully',
//     tcaCoordinators: event.tcaCoordinators,
//   });
// });


// export const addTeamToEventByEventId = asyncHandler(async (req, res, next) => {
//   // console.log(req.user.id);
//   const { teamName, college, participants, paymentReferenceNumber } = req.body.formData;
//   const eventId = req.body.eventId;

//   if (!mongoose.isValidObjectId(eventId)) {
//     return next(new AppError('Wrong URL', 404));
//   }

//   if (!teamName || !college || !participants || !paymentReferenceNumber) {
//     return next(new AppError('All fields are required', 400));
//   }

//   const event = await Event.findById(eventId);
//   const user = await User.findById(req.user.id);

//   if (!user) {
//     console.log('not found');
//     return next(new AppError('User not found.', 404));
//   }

//   if (!event) {
//     console.log('not found1',eventId)
//     return next(new AppError('Invalid Event id or Event not found.', 400));
//   }
//   try {
//     event.teams.push({
//       teamName,
//       college,
//       participants,
//       paymentReferenceNumber,
//       registeredBy: user._id,
//     });


//     event.numberOfParticipants = participants.length;

//     await event.save();

//     user.registeredEvents.push(event._id);
//     await user.save();

//     res.status(200).json({
//       success: true,
//       message: 'Team registered added successfully',
//     });
//   } catch (err) {
//     console.log(err);
//   }

// });

// export const addTcaCoordinatorByEventId = asyncHandler(async (req, res, next) => {
//   const { coordinator } = req.body;
//   // console.log("yes");

//   const { id } = req.params;
//   if (!coordinator) {
//     return next(new AppError('Coordinator details are required', 400));
//   }

//   const event = await Event.findById(id);

//   if (!event) {
//     return next(new AppError('Invalid Event id or Event not found.', 400));
//   }

//   event.tcaCoordinators.push({ coordinator });

//   await event.save();

//   res.status(200).json({
//     success: true,
//     message: 'Coordinator added successfully',
//   });
// });

// export const addFacultyCoordinatorByEventId = asyncHandler(async (req, res, next) => {
//   const { faculty } = req.body;
//   console.log("yes");


//   const { id } = req.params;

//   if (!faculty) {
//     return next(new AppError('Faculty details are required', 400));
//   }

//   const event = await Event.findById(id);

//   if (!event) {
//     return next(new AppError('Invalid Event id or Event not found.', 400));
//   }

//   event.facultyCoordinators.push(faculty);

//   await event.save();

//   res.status(200).json({
//     success: true,
//     message: 'Faculty added successfully',
//     // event,
//   });
// });


// export const addClubCoordinatorById = asyncHandler(async (req, res, next) => {
//   const { coordinator } = req.body;


//   const { id } = req.params;

//   if (!coordinator) {
//     return next(new AppError('Coordinator details are required', 400));
//   }

//   const event = await Event.findById(id);

//   if (!event) {
//     return next(new AppError('Invalid Event id or Event not found.', 400));
//   }

//   event.clubCoordinators.push(coordinator);

//   await event.save();

//   res.status(200).json({
//     success: true,
//     message: 'Added club coordinator',
//     // event,
//   });
// });




// //I don't think we need to remove teams from any where.
// // export const removeParticipantsFromEvent = asyncHandler(async (req, res, next) => {

// //   const { EventId, lectureId } = req.query;

// //   console.log(EventId);

// //   if (!EventId) {
// //     return next(new AppError('Event ID is required', 400));
// //   }

// //   if (!lectureId) {
// //     return next(new AppError('Lecture ID is required', 400));
// //   }

// //   const event = await Event.findById(EventId);

// //   if (!event) {
// //     return next(new AppError('Invalid ID or Event does not exist.', 404));
// //   }

// //   const lectureIndex = event.participants.findIndex(
// //     (lecture) => lecture._id.toString() === lectureId.toString()
// //   );

// //   const clubcoordinatorj = event.clubcoordinator.findIndex(
// //     (lecture) => lecture._id.toString() === lectureId.toString()
// //   );

// //   const tcacoordinatorj = event.tcacoordinator.findIndex(
// //     (lecture) => lecture._id.toString() === lectureId.toString()
// //   );
// //   const facultycoordinatorj = event.facultycoordinator.findIndex(
// //     (lecture) => lecture._id.toString() === lectureId.toString()
// //   );

// //   if (lectureIndex !== -1) {
// //     event.participants.splice(lectureIndex, 1);
// //     event.numberOfLectures = event.participants.length;
// //     await event.save();
// //     res.status(200).json({
// //       success: true,
// //       message: 'Event lecture removed successfully',
// //     });
// //   }

// //   if (clubcoordinatorj !== -1) {
// //     event.clubcoordinator.splice(clubcoordinatorj, 1);
// //     await event.save();
// //     res.status(200).json({
// //       success: true,
// //       message: 'Event clubcoordinator removed successfully',
// //     });
// //   }
// //   if (tcacoordinatorj !== -1) {

// //     event.tcacoordinator.splice(tcacoordinatorj, 1);
// //     await event.save();
// //     res.status(200).json({
// //       success: true,
// //       message: 'Event clubcoordinator removed successfully',
// //     });
// //   }
// //   if (facultycoordinatorj !== -1) {

// //     event.facultycoordinator.splice(facultycoordinatorj, 1);
// //     await event.save();
// //     res.status(200).json({
// //       success: true,
// //       message: 'Event clubcoordinator removed successfully',
// //     });
// //   }


// // });

// export const updateTeamsPaymentVerification = asyncHandler(async (req, res, next) => {
//   const { eventId, teamName, status } = req.body;

//   if (!eventId) {
//     return next(new AppError('Event ID is required', 400));
//   }

//   if (!teamName) {
//     return next(new AppError('Team name is required', 400));
//   }

//   const event = await Event.findById(eventId);

//   if (!event) {
//     return next(new AppError('Invalid ID or Event does not exist.', 404));
//   }

//   // Find the participant by lectureId
//   const team = event.teams.find(team => team.teamName === teamName);

//   if (!team) {
//     return next(new AppError('Team not found.', 404));
//   }
//   team.paymentVerified = status;
//   await team.save();

//   res.status(200).json({
//     success: true,
//     message: 'Team verification updated successfully',
//   });
// });

// export const removeEvent = asyncHandler(async (req, res, next) => {

//   const { id } = req.params;

//   if (!id) {
//     return next(new AppError('Event ID is required', 400));
//   }

//   const event = await Event.findById(id);

//   if (!event) {
//     return next(new AppError('Invalid ID or Event does not exist.', 404));
//   }

//   const result = await Event.findOneAndDelete(id);

//   res.status(200).json({
//     success: true,
//     message: 'Event removed successfully',
//   });


// });


// /**
//  * @UPDATE_Event_BY_ID
//  * @ROUTE @PUT {{URL}}/api/v1/Events/:id
//  * @ACCESS Private (Admin only)
//  */
// export const updateEventById = asyncHandler(async (req, res, next) => {
//   // Extracting the Event id from the request params
//   const { id } = req.params;

//   // Finding the Event using the Event id
//   const event = await Event.findByIdAndUpdate(
//     id,
//     {
//       $set: req.body, // This will only update the fields which are present
//     },
//     {
//       runValidators: true, // This will run the validation checks on the new data
//     }
//   );

//   // If no Event found then send the response for the same
//   if (!event) {
//     return next(new AppError('Invalid Event id or Event not found.', 400));
//   }

//   // Sending the response after success
//   res.status(200).json({
//     success: true,
//     message: 'Event updated successfully',
//   });
// });

// /**
//  * @DELETE_Event_BY_ID
//  * @ROUTE @DELETE {{URL}}/api/v1/Events/:id
//  * @ACCESS Private (Admin only)
//  */
// export const deleteEventById = asyncHandler(async (req, res, next) => {

//   const { id } = req.params;
//   const event = await Event.findById(id);

//   if (!event) {
//     return next(new AppError('Event with given id does not exist.', 404));
//   }

//   await event.remove();

//   res.status(200).json({
//     success: true,
//     message: 'Event deleted successfully',
//   });
// });


import fs from 'fs/promises';
import path from 'path';
import cloudinary from 'cloudinary';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import Course from '../models/Events.model.js';
import AppError from '../utils/AppError.js';
import sendEmail from '../utils/sendEmail.js';
import User from '../models/user.model.js';


export const getAllEvents = asyncHandler(async (req, res, next) => {
  const userid = req.user;
  if (userid.role == 'USER') {
    try {
      const events = await Course.find({
        'participants': {
          $elemMatch: { enrolledby: userid.id }
        }
      });

      res.status(200).json({
        success: true,
        message: 'All Courses',
        events,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }

  if (userid.role == 'ADMIN') {
    try {
      const events = await Course.find({});

      res.status(200).json({
        success: true,
        message: 'All Courses',
        events,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
      });
    }
  }

});


export const createEvent = asyncHandler(async (req, res, next) => {
  const { title, description, club, createdBy } = req.body;

  if (!title || !description || !club || !createdBy) {
    return next(new AppError('All fields are required', 400));
  }

  const event = await Course.create({
    title,
    description,
    club,
    createdBy,
  });

  if (!event) {
    return next(
      new AppError('Course could not be created, please try again', 400)
    );
  }


  await event.save();

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    event,
  });
});


export const getParticipantsByEventId = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { verified } = req.query;
  const userid = req.user;
  console.log("userid");
  console.log(userid);

  try {
    const event = await Course.findById(id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    let participating;

    if (verified === 'true') {
      participating = event.participants.filter(participant => participant.isverified === true);
    } else if (verified === 'false') {
      participating = event.participants.filter(participant => participant.isverified === false);
    } else {
      participating = event.participants;
    }

    res.status(200).json({
      success: true,
      message: 'Course participants fetched successfully',
      participants: participating,
    });
  } catch (error) {
    next(new AppError('Internal Server Error', 500));
  }
});

export const getfacultycordinatorByEventId = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const event = await Course.findById(id);

  if (!event) {
    return next(new AppError('Invalid Course id or Course not found.', 408));
  }

  res.status(200).json({
    success: true,
    message: 'Course participants fetched successfully',
    facultycoordinator: event.facultycoordinator,
  });
});

export const gettcacordinatorByEventId = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const event = await Course.findById(id);

  if (!event) {
    return next(new AppError('Invalid Course id or Course not found.', 408));
  }

  res.status(200).json({
    success: true,
    message: 'Course participants fetched successfully',
    tcacoordinator: event.tcacoordinator,
  });
});


export const addParticipantToEventById = asyncHandler(async (req, res, next) => {
  const { college, teamName, participants } = req.body;
  const userid = req.user;
  const enrolledby = userid.id;
  console.log(" const userid = req.user;", userid);
  const { id } = req.params;
  console.log("req.body", req.body);
  console.log("college", college); console.log("teamName", teamName); console.log("participants", participants);
  let lectureData = {};

  if (!college || !teamName || !participants) {
    return next(new AppError('college,teamName and participants are required', 400));
  }

  const event = await Course.findById(id);

  if (!event) {
    return next(new AppError('Invalid event id or event not found.', 400));
  }

  console.log(event);

  event.participant.push({
    enrolledby,
    college,
    teamName,
    participants
  });

  event.numberOfParticipants = event.participant.length;


  await event.save();

  res.status(200).json({
    success: true,
    message: 'Participant added successfully',
    event,
  });
});

export const addtcacoordinatorById = asyncHandler(async (req, res, next) => {
  const { userid } = req.body;
  console.log("yes");

  const { id } = req.params;
  let tcacoordinator = {};
  if (!userid) {
    return next(new AppError('userid is required', 400));
  }

  const event = await Course.findById(id);

  if (!event) {
    return next(new AppError('Invalid Course id or Course not found.', 400));
  }

  event.tcacoordinator.push({
    userid,
  });

  await event.save();

  res.status(200).json({
    success: true,
    message: 'Course lecture added successfully',
    event,
  });
});

export const addfacultycoordinatorById = asyncHandler(async (req, res, next) => {
  const { userid } = req.body;
  console.log("yes");


  const { id } = req.params;

  let tcacoordinator = {};

  if (!userid) {
    return next(new AppError('userid is required', 400));
  }

  const event = await Course.findById(id);

  if (!event) {
    return next(new AppError('Invalid Course id or Course not found.', 400));
  }



  event.facultycoordinator.push({
    userid,
  });



  await event.save();

  res.status(200).json({
    success: true,
    message: 'Course lecture added successfully',
    event,
  });
});


export const addclubcoordinatorById = asyncHandler(async (req, res, next) => {
  const { userid } = req.body;


  const { id } = req.params;

  let clubcoordinator = {};

  if (!userid) {
    return next(new AppError('userid is required', 400));
  }

  const event = await Course.findById(id);

  if (!event) {
    return next(new AppError('Invalid Course id or Course not found.', 400));
  }


  event.clubcoordinator.push({
    userid,
  });

  await event.save();

  res.status(200).json({
    success: true,
    message: 'invoked club coordinator',
    event,
  });
});

export const addtcacordinatorToEventById = asyncHandler(async (req, res, next) => {
  const { userid } = req.body;


  const { id } = req.params;

  let tcacoordinator = {};

  if (!userid) {
    return next(new AppError('userid is required', 400));
  }

  const event = await Course.findById(id);

  if (!event) {
    return next(new AppError('Invalid Course id or Course not found.', 400));
  }


  event.tcacoordinator.push({
    userid,
  });

  await event.save();

  res.status(200).json({
    success: true,
    message: 'invoked tca cordinator',
    event,
  });
});




export const removeParticipantsFromEvent = asyncHandler(async (req, res, next) => {

  const { courseId, lectureId } = req.query;

  console.log(courseId);

  if (!courseId) {
    return next(new AppError('Course ID is required', 400));
  }

  if (!lectureId) {
    return next(new AppError('Lecture ID is required', 400));
  }

  const event = await Course.findById(courseId);

  if (!event) {
    return next(new AppError('Invalid ID or Course does not exist.', 404));
  }

  const lectureIndex = event.participants.findIndex(
    (lecture) => lecture._id.toString() === lectureId.toString()
  );

  const clubcoordinatorj = event.clubcoordinator.findIndex(
    (lecture) => lecture._id.toString() === lectureId.toString()
  );

  const tcacoordinatorj = event.tcacoordinator.findIndex(
    (lecture) => lecture._id.toString() === lectureId.toString()
  );
  const facultycoordinatorj = event.facultycoordinator.findIndex(
    (lecture) => lecture._id.toString() === lectureId.toString()
  );

  if (lectureIndex !== -1) {




    event.participants.splice(lectureIndex, 1);


    event.numberOfLectures = event.participants.length;


    await event.save();


    res.status(200).json({
      success: true,
      message: 'Course lecture removed successfully',
    });
  }

  if (clubcoordinatorj !== -1) {





    event.clubcoordinator.splice(clubcoordinatorj, 1);


    // Save the Course object
    await event.save();

    // Return response
    res.status(200).json({
      success: true,
      message: 'Course clubcoordinator removed successfully',
    });
  }
  if (tcacoordinatorj !== -1) {

    event.tcacoordinator.splice(tcacoordinatorj, 1);
    await event.save();
    res.status(200).json({
      success: true,
      message: 'Course clubcoordinator removed successfully',
    });
  }
  if (facultycoordinatorj !== -1) {

    event.facultycoordinator.splice(facultycoordinatorj, 1);
    await event.save();
    res.status(200).json({
      success: true,
      message: 'Course clubcoordinator removed successfully',
    });
  }


});

export const updateParticipantVerification = asyncHandler(async (req, res, next) => {
  const { courseId, lectureId } = req.query;
  const { subjects, messages, isverified } = req.body;
  console.log("subject-", subjects, "--messages", messages);

  if (!courseId) {
    return next(new AppError('Course ID is required', 400));
  }

  if (!lectureId) {
    return next(new AppError('Lecture ID is required', 400));
  }

  const event = await Course.findById(courseId);

  if (!event) {
    return next(new AppError('Invalid ID or Course does not exist.', 404));
  }

  // Find the participant by lectureId
  const participant = event.participants.find(participant => participant._id.toString() === lectureId.toString());

  if (!participant) {
    return next(new AppError('Participant not found.', 404));
  }

  const user = await User.findById(participant.enrolledby);

  const email = user.email;

  if (isverified) {
    participant.isverified = true;
    await event.save();


    const subject = 'Participant Verification';
    const message = "You have been successfully Verified";
    await sendEmail(email, subject, message);
  }

  if (!isverified) {
    const subject = subjects;
    const message = messages;
    console.log("email-", email);
    await sendEmail(email, subject, message);
  }

  res.status(200).json({
    success: true,
    message: 'Participant verification updated successfully',
  });
});

export const removeEvent = asyncHandler(async (req, res, next) => {

  const { id } = req.params;
  // const { id } = req.params;


  if (!id) {
    return next(new AppError('Course ID is fgvbhfcgvhbj required', 400));
  }

  const event = await Course.findById(id);

  if (!event) {
    return next(new AppError('Invalid ID or Course does not exist.', 404));
  }


  const result = await event.findOneAndDelete(id);


  await event.save();

  res.status(200).json({
    success: true,
    message: 'Course lecture removed successfully',
  });


});


/**
 * @UPDATE_Course_BY_ID
 * @ROUTE @PUT {{URL}}/api/v1/Courses/:id
 * @ACCESS Private (Admin only)
 */
export const updateEventById = asyncHandler(async (req, res, next) => {

  const { id } = req.params;

  const event = await Course.findByIdAndUpdate(
    id,
    {
      $set: req.body, // This will only update the fields which are present
    },
    {
      runValidators: true, // This will run the validation checks on the new data
    }
  );

  // If no Course found then send the response for the same
  if (!event) {
    return next(new AppError('Invalid Course id or Course not found.', 400));
  }

  // Sending the response after success
  res.status(200).json({
    success: true,
    message: 'Course updated successfully',
  });
});


export const deleteEventById = asyncHandler(async (req, res, next) => {

  const { id } = req.params;


  const event = await Course.findById(id);


  if (!event) {
    return next(new AppError('Course with given id does not exist.', 404));
  }


  await event.remove();

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully',
  });
});