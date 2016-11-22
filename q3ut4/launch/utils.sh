#########
# Utils #
#########

# Raw jq
jqr() {
  jq --compact-output --raw-output "$@"
}

# Silent grep
grepn() {
  grep -q -s "$@"
}

# Returns a code 0 if the input is "true", 1 otherwise
# $1: the string to evaluate
isTrue() {
  [ -z "$1" ] && { return 1; }
  [ "$1" = "true" ] && { return 0; }
  return 1
}

# Returns a code 1 if the input is "true", 0 otherwise
# $1: the string to evaluate
isFalse() {
  if isTrue "$1"; then
    return 1
  else
    return 0
  fi
}

# Returns a code 1 if the input is "null" or empty, 0 otherwise
# $1: the value to check
isNotNull() {
  [ -z "$1" ] && { return 1; }
  [ "$1" = "null" ] && { return 1; }
  return 0
}

# Returns a code 1 if the input is "null" or empty, 0 otherwise
# Uses: isNotNull
# $1: the value to check
isNull() {
  if isNotNull "$1"; then
    return 1
  else
    return 0
  fi
}

# Returns a default value if input not specified, input otherwise
# $1: the default value
# $2: the input
# $3: the optional regex that the input should match
readVar() {
  if [ -z "$2" ]; then
    echo "$1"; return 0
  else
    if [ -n "$3" ]; then
      regex="^$3$"
      if [[ "$2" =~ $regex ]]; then
        echo "$2"; return 0
      else
        echo "$1"; return 0
      fi
    else
      echo "$2"; return 0
    fi
  fi
}
