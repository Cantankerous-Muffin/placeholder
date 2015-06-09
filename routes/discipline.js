var express = require('express');
var router = express.Router();

var Student  = require('./../app/models/student');
var Instructor  = require('./../app/models/instructor');

var passport = require('passport');
var path         = require('path');
var DBQuery = require('../utils/dbQueries.js')
var db = require('../app/config.js')

// var studentRoute = require('./student');
// var instructorRoute = require('./instructor');

router.get('/', function(req, res) {
	// return all the disciplines
	console.log('req.url is', req.url);
	db.knex('disciplines')
		.map(function(discipline){

			return db.knex('classes')
				.where({'classes.discipline_id': discipline.id})
				.map(function(classData){
					console.log('classData',classData);
					// discipline.classes = classData;
					// discipline.totalClass = classData.length;
					// classData.discipline = discipline;
					
					return db.knex('levels')
						.where({'levels.class_id':classData.id})
						.then(function(datapack){
							console.log('datapack',datapack, 'classData.instructor_id', classData.instructor_id);
							classData.totalLevel = datapack.length;
							return db.knex('instructors')
								.where({'instructors.id': classData.instructor_id})
								.select('username')
								.then(function(instrData){
									// console.log('instrData', instrData[0]);
									classData.instructor_name = instrData[0].username;
									return classData;
								})
						})

				})
				.then(function(collatedClassData){
					// console.log('discipline',discipline, 'collatedClassData', collatedClassData);
					discipline.classData = collatedClassData;
					return discipline;
				})

			})
		.then(function(disciplineData){
			// console.log('disciplineData',disciplineData);
			res.json(disciplineData);
		});
});

router.get('/:discipline_id', function(req, res) {
	console.log('url for discipline_id', req.url);
db.knex('disciplines')
		.where({'disciplines.id': req.url.slice(1)})
		.map(function(discipline){
			return db.knex('classes')
				.where({'classes.discipline_id': discipline.id})
				.map(function(classData){
					console.log('classData',classData);
					// discipline.classes = classData;
					// discipline.totalClass = classData.length;
					// classData.discipline = discipline;
					
					return db.knex('levels')
						.where({'levels.class_id':classData.id})
						.then(function(datapack){
							console.log('datapack',datapack, 'classData.instructor_id', classData.instructor_id);
							classData.totalLevel = datapack.length;
							return db.knex('instructors')
								.where({'instructors.id': classData.instructor_id})
								.select('username')
								.then(function(instrData){
									// console.log('instrData', instrData[0]);
									classData.instructor_name = instrData[0].username;
									return classData;
								})
						})

				})
				.then(function(collatedClassData){
					// console.log('discipline',discipline, 'collatedClassData', collatedClassData);
					discipline.classData = collatedClassData;
					return discipline;
				})

			})
			.catch(function(err){
				res.json({'message':err})
			})
		.then(function(disciplineData){
			// console.log('disciplineData',disciplineData);
			console.log('disciplineData',disciplineData[0])
			if (!disciplineData[0]){
				res.json({'message':'No discipline found for '+ req.url.slice(1)});
			}
			res.json(disciplineData[0]);
		});
});

router.get('/:discipline_id/class', function(req, res) {
	console.log('url for discipline_id', req.url);
db.knex('disciplines')
		.where({'disciplines.id': req.url.match(/\w+/)[0]})
		.then(function(discipline){
			console.log('discipline',discipline);
			db.knex('classes')
				.where({'classes.discipline_id': discipline[0].id})
				.map(function(classData){
					console.log('classData',classData);
					// discipline.classes = classData;
					// discipline.totalClass = classData.length;
					// classData.discipline = discipline;
					
					return db.knex('levels')
						.where({'levels.class_id':classData.id})
						.then(function(datapack){
							// console.log('datapack',datapack, 'classData.instructor_id', classData.instructor_id);
							classData.totalLevel = datapack.length;
							return db.knex('instructors')
								.where({'instructors.id': classData.instructor_id})
								.select('*')
								.then(function(instrData){
									// console.log('instrData', instrData[0]);
									classData.instructor_name = instrData[0].username;
									// set instructor_id to 2 if not found.
									instrData[0].id = instrData[0].id || 2;
									console.log('gets here discipline is', discipline[0].id, instrData[0].id);
									return db.knex('ranks')
										.where({'ranks.instructor_id': instrData[0].id, 'ranks.discipline_id': discipline[0].id})
										.then(function(instructorRankData){
											console.log('instructorRankData',instructorRankData);
											if (!instructorRankData[0]){
												return {'message': 'instructor not assigned to one of the classes. Check DB'};
											}
											classData.instructorRankTitle = instructorRankData[0].rankTitle;
											classData.instructorRankNum = instructorRankData[0].rankNum;
											return classData;
										})
								})
						})

				})
				.then(function(collatedClassData){
					// console.log('discipline',discipline, 'collatedClassData', collatedClassData);
					// discipline.classData = collatedClassData;
					if (!collatedClassData[0]){
						res.json({'message':'No classes found for discipline'+ req.url.slice(1)});
					}
					res.json(collatedClassData);
				})

			})
			.catch(function(err){
				res.json({'message':err})
			});
});

module.exports = router;