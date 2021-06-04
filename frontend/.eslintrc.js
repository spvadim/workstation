module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "accessor-pairs": "off",
        "array-bracket-newline": "off",
        "array-bracket-spacing": [
            "off",
            "never"
        ],
        "array-callback-return": "off",
        "array-element-newline": "off",
        "arrow-body-style": "off",
        "arrow-parens": "off",
        "arrow-spacing": "off",
        "block-scoped-var": "off",
        "block-spacing": [
            "warn",
            "never"
        ],
        "brace-style": "off",
        "callback-return": "off",
        "capitalized-comments": "off",
        "class-methods-use-this": "off",
        "comma-dangle": "off",
        "comma-spacing": [
            "off",
            {
                "after": true,
                "before": false
            }
        ],
        "comma-style": [
            "off",
            "last"
        ],
        // "complexity": "off",
        "computed-property-spacing": [
            "off",
            "never"
        ],
        "consistent-this": "off",
        "curly": "off",
        "default-case": "off",
        "default-case-last": "off",
        "default-param-last": "off",
        "dot-location": [
            "off",
            "property"
        ],
        "dot-notation": "off",
        "eol-last": "off",
        "eqeqeq": "off",
        "func-call-spacing": "off",
        "func-name-matching": "off",
        "func-names": "off",
        "func-style": [
            "off",
            "declaration",
            {
                "allowArrowFunctions": true
            }
        ],
        "function-call-argument-newline": [
            "off",
            "consistent"
        ],
        "function-paren-newline": "off",
        "generator-star-spacing": "off",
        "global-require": "off",
        "grouped-accessor-pairs": "off",
        "guard-for-in": "off",
        "handle-callback-err": "off",
        "id-blacklist": "off",
        "id-denylist": "off",
        "id-length": "off",
        "id-match": "off",
        "implicit-arrow-linebreak": [
            "off",
            "beside"
        ],
        "indent": "off",
        "indent-legacy": "off",
        "init-declarations": "off",
        "jsx-a11y/anchor-is-valid": 0,
        "jsx-quotes": [
            "off",
            "prefer-double"
        ],
        "key-spacing": "off",
        "keyword-spacing": "off",
        "line-comment-position": "off",
        "lines-around-comment": "off",
        "lines-around-directive": "off",
        "lines-between-class-members": "off",
        "max-depth": "off",
        "max-len": "off",
        "max-lines": "off",
        "max-lines-per-function": "off",
        "max-nested-callbacks": "off",
        "max-params": "off",
        "max-statements": "off",
        "max-statements-per-line": "off",
        "multiline-ternary": "off",
        "new-parens": "off",
        "newline-after-var": "off",
        "newline-before-return": "off",
        "newline-per-chained-call": "off",
        "no-alert": "off",
        "no-array-constructor": "off",
        "no-await-in-loop": "off",
        "no-bitwise": "off",
        "no-buffer-constructor": "off",
        "no-caller": "off",
        "no-catch-shadow": "off",
        "no-confusing-arrow": "off",
        "no-console": "off",
        "no-constant-condition": "warn",
        "no-constructor-return": "off",
        "no-continue": "off",
        "no-debugger": "warn",
        "no-div-regex": "off",
        "no-duplicate-imports": "off",
        "no-else-return": "off",
        "no-empty-function": "off",
        "no-eq-null": "off",
        "no-eval": "off",
        "no-extend-native": "off",
        "no-extra-bind": "off",
        "no-extra-label": "off",
        "no-extra-parens": "off",
        "no-floating-decimal": "off",
        "no-implicit-globals": "off",
        "no-implied-eval": "off",
        "no-inline-comments": "off",
        "no-invalid-this": "off",
        "no-iterator": "off",
        "no-label-var": "off",
        "no-labels": "off",
        "no-lone-blocks": "off",
        "no-lonely-if": "off",
        "no-loop-func": "off",
        "no-loss-of-precision": "off",
        "no-magic-numbers": "off",
        "no-mixed-operators": "off",
        "no-mixed-requires": "off",
        "no-multi-assign": "off",
        "no-multi-spaces": "off",
        "no-multi-str": "off",
        "no-multiple-empty-lines": "off",
        "no-native-reassign": "off",
        "no-negated-condition": "off",
        "no-negated-in-lhs": "off",
        "no-nested-ternary": "off",
        "no-new": "off",
        "no-new-func": "off",
        "no-new-object": "off",
        "no-new-require": "off",
        "no-new-wrappers": "off",
        "no-octal-escape": "off",
        "no-param-reassign": "off",
        "no-path-concat": "off",
        "no-unreachable": "warn",
        "no-plusplus": [
            "off",
            {
                "allowForLoopAfterthoughts": true
            }
        ],
        "no-process-env": "off",
        "no-process-exit": "off",
        "no-promise-executor-return": "off",
        "no-proto": "off",
        "no-restricted-exports": "off",
        "no-restricted-globals": "off",
        "no-restricted-imports": "off",
        "no-restricted-modules": "off",
        "no-restricted-properties": "off",
        "no-restricted-syntax": "off",
        "no-return-assign": "off",
        "no-return-await": "off",
        "no-script-url": "off",
        "no-self-compare": "off",
        "no-sequences": "off",
        "no-shadow": "off",
        "no-spaced-func": "off",
        "no-sync": "off",
        "no-tabs": [
            "off",
            {
                "allowIndentationTabs": true
            }
        ],
        "no-template-curly-in-string": "off",
        "no-ternary": "off",
        "no-throw-literal": "off",
        "no-trailing-spaces": "off",
        "no-undef-init": "off",
        "no-undef": "off",
        "no-undefined": "off",
        "no-unmodified-loop-condition": "off",
        "no-unneeded-ternary": "off",
        "no-unreachable-loop": "off",
        "no-unused-expressions": "off",
        "no-unused-vars": "warn",
        "no-use-before-define": "off",
        "no-useless-backreference": "off",
        "no-useless-call": "off",
        "no-useless-computed-key": "off",
        "no-useless-concat": "off",
        "no-useless-constructor": "off",
        "no-useless-rename": "off",
        "no-useless-return": "warn",
        "no-var": "off",
        "no-void": "off",
        "no-warning-comments": "warn",
        "no-whitespace-before-property": "off",
        "nonblock-statement-body-position": "off",
        "object-curly-newline": "off",
        "object-curly-spacing": "off",
        "object-shorthand": "off",
        "one-var": "off",
        "one-var-declaration-per-line": "off",
        "operator-assignment": "off",
        "operator-linebreak": [
            "off",
            "after"
        ],
        "padded-blocks": "off",
        "padding-line-between-statements": "off",
        "prefer-arrow-callback": "off",
        "prefer-const": "off",
        "prefer-destructuring": "off",
        "prefer-exponentiation-operator": "off",
        "prefer-named-capture-group": "off",
        "prefer-numeric-literals": "off",
        "prefer-object-spread": "off",
        "prefer-promise-reject-errors": "off",
        "prefer-reflect": "off",
        "prefer-regex-literals": "off",
        "prefer-rest-params": "off",
        "prefer-spread": "off",
        "prefer-template": "off",
        "quote-props": "off",
        "quotes": "off",
        "radix": "off",
        "react/display-name": "off",
        "react/jsx-key": "warn",
        "react/prop-types": "off",
        "require-atomic-updates": "off",
        "require-await": "off",
        "require-jsdoc": "off",
        "require-unicode-regexp": "off",
        "rest-spread-spacing": "off",
        "semi": "off",
        "semi-spacing": [
            "off",
            {
                "after": true,
                "before": false
            }
        ],
        "semi-style": [
            "off",
            "last"
        ],
        "sort-keys": "off",
        "sort-vars": "off",
        "space-before-blocks": "off",
        "space-before-function-paren": "off",
        "space-in-parens": [
            "off",
            "never"
        ],
        "space-infix-ops": "off",
        "space-unary-ops": "off",
        "spaced-comment": [
            "off",
            "always"
        ],
        "strict": "off",
        "switch-colon-spacing": "off",
        "symbol-description": "off",
        "template-curly-spacing": [
            "off",
            "never"
        ],
        "template-tag-spacing": "off",
        "unicode-bom": [
            "off",
            "never"
        ],
        "valid-jsdoc": "off",
        "vars-on-top": "off",
        "wrap-iife": "off",
        "wrap-regex": "off",
        "yield-star-spacing": "off",
        "yoda": [
            "off",
            "never"
        ]
    }
};
