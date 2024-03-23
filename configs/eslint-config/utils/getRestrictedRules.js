const { removeFromArray } = require('./removeFromArray')

exports.getRestrictedRules = function (rules, baseRestrictedRules = []) {
  let restrictedRuleNames = [...baseRestrictedRules]

  Object.keys(rules).forEach((ruleName) => {
    const ruleValue = rules[ruleName]
    const severity = Array.isArray(ruleValue) ? ruleValue[0] : ruleValue

    const isDisabled = severity === 'off' || severity === 0

    if (isDisabled) {
      restrictedRuleNames = removeFromArray(restrictedRuleNames, ruleName)
      return
    }

    const isError = severity === 'error' || severity === 2

    if (isError) {
      restrictedRuleNames = [...restrictedRuleNames, ruleName]
    }
  })

  return restrictedRuleNames
}
