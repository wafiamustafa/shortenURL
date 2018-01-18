'use strict';

const _ = require('lodash');
const sinon = require('sinon');
const { createApolloFetch } = require('apollo-fetch');

// Graphql URL - DEV - Testing - never production
const uri = 'https://4dw12ykdkk.execute-api.eu-west-1.amazonaws.com/dev/graphql'
// Predefined AUTH_JWT used for integration tests
const AUTH_JWT = 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVhNDZmZjlkNGVmZWVmMDAwMWU2MmViZSIsInVwZGF0ZWRBdCI6IjIwMTctMTItMzFUMTI6MDM6MzYuNjAzWiIsImNyZWF0ZWRBdCI6IjIwMTctMTItMzBUMDI6NTM6MTcuNzE3WiIsImNvdW50cnlDb2RlIjoiKzIwIiwicGhvbmUiOiIxMjI4NTUwMTA1IiwibmFtZSI6IkRpYWEgS2FzZW0iLCJlbmFibGVkIjp0cnVlLCJ0ZXJtc0FjY2VwdGVkIjp0cnVlLCJfX3YiOjAsImp3dFRva2VuIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SjFjMlZ5SWpwN0lsOXBaQ0k2SWpWaE5EWm1aamxrTkdWbVpXVm1NREF3TVdVMk1tVmlaU0lzSW5Wd1pHRjBaV1JCZENJNklqSXdNVGN0TVRJdE16QlVNRE02TURJNk1Ua3VOakV3V2lJc0ltTnlaV0YwWldSQmRDSTZJakl3TVRjdE1USXRNekJVTURJNk5UTTZNVGN1TnpFM1dpSXNJbU52ZFc1MGNubERiMlJsSWpvaUt6SXdJaXdpY0dodmJtVWlPaUl4TWpJNE5UVXdNVEExSWl3aWJtRnRaU0k2SWtScFlXRWdTMkZ6WlcwaUxDSmxibUZpYkdWa0lqcDBjblZsTENKMFpYSnRjMEZqWTJWd2RHVmtJanAwY25WbExDSmZYM1lpT2pBc0ltcDNkRlJ2YTJWdUlqb2laWGxLYUdKSFkybFBhVXBKVlhwSk1VNXBTWE5KYmxJMVkwTkpOa2xyY0ZoV1EwbzVMbVY1U2pGak1sWjVTV3B3TjBsc09YQmFRMGsyU1dwV2FFNUVXbTFhYW14clRrZFdiVnBYVm0xTlJFRjNUVmRWTWsxdFZtbGFVMGx6U1c1V2QxcEhSakJhVjFKQ1pFTkpOa2xxU1hkTlZHTjBUVlJKZEUxNlFsVk5SRWsyVGxSTk5rMVVZM1ZPZWxWNVYybEpjMGx0VG5sYVYwWXdXbGRTUW1SRFNUWkpha2wzVFZSamRFMVVTWFJOZWtKVlRVUkpOazVVVFRaTlZHTjFUbnBGTTFkcFNYTkpiVTUyWkZjMU1HTnViRVJpTWxKc1NXcHZhVXQ2U1hkSmFYZHBZMGRvZG1KdFZXbFBhVWw0VFdwSk5FNVVWWGROVkVFeFNXbDNhV0p0Um5SYVUwazJTV3RTY0ZsWFJXZFRNa1o2V2xjd2FVeERTbXhpYlVacFlrZFdhMGxxY0RCamJsWnNURU5LTUZwWVNuUmpNRVpxV1RKV2QyUkhWbXRKYW5Bd1kyNVdiRXhEU21aWU0xbHBUMnBCYzBsdGNETmtSbEoyWVRKV2RVbHFiMmxhV0d4TFlVZEtTRmt5YkZCaFZYQktWbGh3U2sxVk5YQlRXRTVLWW14Sk1Wa3dUa3BPYTJ4eVkwWm9WMUV3YnpWTWJWWTFVMnBHYWsxc1dqVlRWM0IzVGpCc2MwOVhXbXRoVldzeVZGVk9NMkZYVWxsUmJYUmFWMFpLYzFkclZrZE5SV3h4WWpKc1RtRnJSalJVYm10M1pVVXhjRTFJY0U1U2JFWXpWRmR3ZGsxVk1UWmlNMmhQWlZSUmVsUldVbXRaVld4d1pESnNXazB3Y0hOWFZtaFRZa1p3UmxKcVFrcGhiVGx3VkZkd1FtVkZOVFZOU0doT1lWUkNObFJWV2xKa01ERnhZbnBHVG1WdE9UUlVibXN3VFRBeFZWcEhSa3BoV0dSd1YxUkpOVTFYU25WVmJteHNWbFUxTWxkclpGWmhWVGx3VTFoS1RtRnJSbkJVUlU1TFpESkdTRTlZVm1GVk1Hc3lVMWR3Um1WVk1YRmFla1pQVmtWR05GUlZVbFpoVlhoRVUyNVdXbFo2Um5OVFYzQjJZVlpLU0dKSGFGcFZNRXBOVjFab1QySkhTbFJUV0U1S1lsWmFNVmRXWkV0ak1YQllWVmRzVUdKc1NqVmFSbVJXWXpCc2RWVnRlR3BpVkVZMlZWWmtUMkZzY0ZsUmFrSmhWakZHY0ZReU5WTmxWMUpZVmxoT1NtSkViSGRYYTA1S1RtdHNjVlp0YUU5U1JuQjBWMjF3YzJFd05VaFdiVEZoVmpGYWRGUlZVa0prTURGWVZsUktUbUpXV25CWGJFNUtZekJzZEZOdGFHdFRSa3B6V1RJMWMxUldjRmxYYlhocFVUQnJNbFJXVWtKa01scFVaREpzYUZZd1dYZFRWM0IyWlVVMVZWSlVRazloYTBZMVZGaHdjazB5V2xKTWEwWldUV3Q0VkdNeWVIRmFNMEY2VGtad1IxWkVhM2xWUldST1lucGFlbEp0VWxwYVdHeGhZbnBDVWxrd1VsTmtSVVpMVTJwU1dsb3dSV2xNUTBwcFdWaFNNRnBZU2pWVVIxWXlXbGQzYVU5cVJYZE5TREJ6U1cxc2FHUkRTVFpOVkZWNFRrUlpkMDFxYTNwUFdEQXVWM1p6TmtNMVZUVkdlVkZDVVhScVRqRmFURk0wWVZrNVVXTmlXa053ZGkxTExXdEdlbXMyTW01RmR5SXNJbUpoZEhSbGNubE1aWFpsYkNJNk1UQXdmU3dpYVdGMElqb3hOVEUwTmpNMk5qZzFmUS5HUGhXcGc5YlVhTFlmLV9Ud2o3V2dDTWJ4UlJUa3ZVV3FTWE9iaUgyQzJ3IiwicHJvZmlsZSI6IjVhNDhkMjE4MjQ1YTgwNjIzOTJiMjZiNCIsImJhdHRlcnlMZXZlbCI6MTAwfSwiaWF0IjoxNTE0ODA2Njg3fQ.mC4nuEhFdu0ZQkdDMQAMUH8Up0tDnlv4SfUlns2RvG8';
// User ID to be used while integration tests
const USER_ID = "5a46ff9d4efeef0001e62ebe";

module.exports.USER_ID = USER_ID;

const fetch = createApolloFetch({ uri });

// Appollo fetch middle wear ..
fetch.use(({ request, options }, next) => {
  if (!options.headers) {
    options.headers = {};  // Create the headers object if needed.
  }
  options.headers['Authorization'] = AUTH_JWT;
  // console.error("FETCH Request", request);
  // console.error("FETCH OPTIONS", options);
  next();
});

module.exports.bindStub = function(module, functionName, sinonStub) {
    if (module) {
        module['_' + functionName] = module[functionName];
        module[functionName] = sinonStub;
    }
};

module.exports.unbindStub = function(module, functionName) {
    if (module) {
        module[functionName] = module['_' + functionName];
    }
};


/**
 * Builds a db model stub
 *
 * @params models The models to be used to hold the stubs ( can be null )
 * @params name The name of the stub ( can be null )
 * @params resolvableModel The class methods.
 * Directly executed from the model.
 * ex. User.find , Location.findOne
 * @params prototypicalResolvables The instance methods.
 * Executed from instance which is created from (instance = new Model())
 * ex. let user = new User({name: 'blah'}); user.save()
 */
module.exports.modelStub = (models, name, resolvableModel, prototypicalResolvables)=> {
    // console.error('==================');
    // console.error("BUILDING Model", name);
    // console.error(`Building model stub ${name}`);
    let model = sinon.stub();
    let modelMethods = {};
    let modelPromises = {};
    let instanceMethods = {};
    let instancePromises = {};
    if (resolvableModel) {
        _.each(resolvableModel, (resolvable, method)=> {
            modelMethods[method] = sinon.stub();
        });
        _.each(resolvableModel, (resolvable, funcName)=> {
            let promise = new Promise((resolve, reject) => {
                return resolve(resolvable);
            });
            let ret = sinon.stub().returns(promise);
            modelPromises[funcName] = promise;
            modelMethods[funcName] = ret;
        });
        _.each(resolvableModel, (resolvable, funcName)=> {
            let ret = modelMethods[funcName];
            let promise = modelPromises[funcName];
            // console.error("INJECTING Into", funcName);
            _.each(modelMethods, (stub, method)=> {
                // console.error("INJECTING with", method);
                promise[method] = stub;
            });
            ret.returns(promise);
            model[funcName] = ret;
        });
    }
    if (prototypicalResolvables) {
        _.each(prototypicalResolvables, (resolvable, method)=> {
            instanceMethods[method] = sinon.stub();
        });
        _.each(prototypicalResolvables, (resolvable, funcName)=> {
            let promise = new Promise((resolve, reject) => {
                return resolve(resolvable);
            });
            let ret = sinon.stub().returns(promise);
            instancePromises[funcName] = promise;
            instanceMethods[funcName] = ret;
        });
        _.each(prototypicalResolvables, (resolvable, funcName)=> {
            let ret = instanceMethods[funcName];
            let promise = instancePromises[funcName];
            _.each(instanceMethods, (stub, method)=> {
                promise[method] = stub;
            });
            ret.returns(promise);
            model.prototype[funcName] = ret;
        });
    }
    if (models && name) {
        // console.error(`Assigning stub ${name} to model`);
        models.withArgs(name).resolves(model);
    }
    return model;
};

/**
 * Queries graphql API with the gql query, and if needed variables
 * @param {GQL} gqlQuery The query/mutation to execute
 * @param {Object} variables The arguments to be passed to the query
 *  const variables = {
 *    repoFullName: 'apollographql/apollo-fetch',
 *  };
 */
module.exports.gql = (gqlQuery, variables) => {
  let args = {query: gqlQuery};
  if (variables) {
    args.variables = variables;
  }
  // resolves to  { data, error, extensions }
  return fetch(args);
};

