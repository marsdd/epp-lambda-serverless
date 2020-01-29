/*jshint esversion: 6 */
/*eslint strict: ["error", "function"]*/
// 'use strict';

const keys = require('../util/kms.js');

let details = {};

module.exports.get = (event, context, callback) => {
  const params = {
    id: event.pathParameters.id,
  };

  keys.decryptSecrets(cb);

  // callback to execute after decryption
  function cb(kms_obj) {
    let db = kms_obj.db;
    let config_db = kms_obj.config_db;

    // a.s. get all abilities related to soc_id
    const q = `select * from ${config_db.schema}.get_abilities('${params.id}');`;

    console.log('Requested query:', q);

    db.query(q, (err, res_ability) => {
      if (err) {
        console.log('There was an error res_ability: ', err);
        return res_ability.status(500).send();
      }

      // add abilities to the object
      details.ability = {
        "count": res_ability.rowCount,
        "data": res_ability
      };

      // a.s. get all skills related to soc_id
      const q = `select * from ${config_db.schema}.get_skills('${params.id}');`;

      console.log('Requested query:', q);

      db.query(q, (err, res_skill) => {
        if (err) {
          console.log('There was an error res_skill: ', err);
          return res_skill.status(500).send();
        }

        // add skills to the object
        details.skill = {
          "count": res_skill.rowCount,
          "data": res_skill
        };

        // a.s. get all education related to soc_id
        const q = `select * from ${config_db.schema}.get_education('${params.id}');`;

        console.log('Requested query:', q);

        db.query(q, (err, res_edu) => {
          if (err) {
            console.log('There was an error res_edu: ', err);
            return res_edu.status(500).send();
          }

          // add skills to the object
          details.education = {
            "count": res_edu.rowCount,
            "data": res_edu
          };

          // g.c. get all training related to soc_id
          const q = `select * from ${config_db.schema}.get_training('${params.id}');`;

          console.log('Requested query:', q);

          db.query(q, (err, res_trn) => {
            if (err) {
              console.log('There was an error res_trn: ', err);
              return res_trn.status(500).send();
            }


            // add training to the object
            details.training = {
              "count": res_trn.rowCount,
              "data": res_trn
            };

            // g.c. get alternate titles related to soc_id
            const q = `select * from ${config_db.schema}.get_alt_titles('${params.id}', 10);`;

            console.log('Requested query:', q);

            db.query(q, (err, res_alt) => {
              if (err) {
                console.log('There was an error res_trn: ', err);
                return res_alt.status(500).send();
              }


              // add alt titles to the object
              details.altTitles = {
                "count": res_alt.rowCount,
                "data": res_alt
              };

              console.log(JSON.stringify(details));
              db.end();

              // create a response
              const response = {
                statusCode: 200,
                headers: {
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Credentials': true,
                }, // a.s. for now allow calls from anywhere
                body: JSON.stringify(details),
              };

              callback(null, response);

            });


        });
      });
      });
    });
  }

};
