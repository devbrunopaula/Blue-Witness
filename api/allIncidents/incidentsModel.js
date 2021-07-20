/* eslint-disable prettier/prettier */
const db = require('../../data/db-config');

module.exports = {
  getIncidents,
  getIncidentById,
  getTimelineIncidents,
  getAllPendingIncidents,
  getAllRejectedIncidents,
  getAllApprovedIncidents,
  getLastID,
  createIncident,
  updateIncident,
  deleteDB,
  deleteIncident,
};
/**
 * Returns all incidents in the db sorted by newest incident first
 */
async function getIncidents() {
  return await db('incidents')
    .whereNot({ date_created: null })
    .orderBy('date', 'desc');
}
/**
 * @param {string} id
 * Function to return a specific incident by provided id
 */
function getIncidentById(id) {
  return db('incidents').where('incident_id', id);
}
/**
 *
 * @param {number} limit
 * Returns incidents in the database sorted by newest incident first limited by the number defined in limit parameter
 */
async function getTimelineIncidents(limit) {
  return await db('incidents')
    .whereNot({ date: null })
    .orderBy('date_created', 'desc')
    .limit(limit);
}
/**
 * Returns all pending Twitter incidents in the db sorted by newest incident first
 */
async function getAllPendingIncidents() {
  const incidents = await db('incidents')
    .where({ status: 'pending' })
    .orderBy('date_created', 'desc');

  const formattedIncidents = incidents.map((incident) => {
    incident.tags = JSON.parse(incident.tags);
    incident.src = `https://twitter.com/${incident.user_name}/status/${incident.tweet_id}`;
    delete incident.tweet_id;
    return incident;
  });

  return formattedIncidents;
}
/**
 * Returns all rejected Twitter incidents in the db sorted by newest incident first
 */
async function getAllRejectedIncidents() {
  const incidents = await db('incidents')
    .where({ status: 'rejected' })
    .orderBy('date_created', 'desc');

  const formattedIncidents = incidents.map((incident) => {
    incident.tags = JSON.parse(incident.tags);
    incident.src = `https://twitter.com/${incident.user_name}/status/${incident.tweet_id}`;
    delete incident.tweet_id;
    return incident;
  });

  return formattedIncidents;
}
/**
 * Returns all approved Twitter incidents in the db sorted by newest incident first
 */
async function getAllApprovedIncidents() {
  const incidents = await db('incidents')
    .where({ status: 'approved' })
    .orderBy('date_created', 'desc');

  const formattedIncidents = incidents.map((incident) => {
    incident.tags = JSON.parse(incident.tags);
    incident.src = `https://twitter.com/${incident.user_name}/status/${incident.tweet_id}`;
    delete incident.tweet_id;
    return incident;
  });

  return formattedIncidents;
}
/**
 * Returns the last known id in the database
 */
function getLastID() {
  return db('incidents').max('id');
}
/**
 * @param {object} incident
 * Helper function for individual incident insertion
 */
async function createIncident(incident) {
  const newIncident = {
    date_created: incident.date,
    city: incident.city,
    state: incident.state,
    lat: incident.lat,
    long: incident.long,
    title: incident.title,
    desc: incident.desc,
    tags: JSON.stringify(incident.tags),
    force_rank: incident.force_rank,
    confidence: incident.confidence,
    status: incident.status,
    user_name: incident.username,
  };
  return db('incidents').insert(newIncident);
}
/**
 * @param {string} id
 * @param {Object} changes
 * Function to Edit and return a specific Twitter incident by provided id
 */
async function updateIncident(id, changes) {
  try {
    await db('incidents').where('incident_id', id).update(changes);
    return getIncidentById(id);
  } catch (error) {
    throw new Error(error.message);
  }
}
/**
 * Utility function to clear database contents
 */
async function deleteDB() {
  return await db('incidents').del();
}

function deleteIncident(id) {
  return db('incidents').where({ id }).del();
}
