########
# JSON #
########

test -f "$DIR/utils.sh" && { . "$_"; }

# Gets all the attribute's values of the given JSON object.
# Uses: json module
# $1: the JSON object, can be piped
jsonValues() {
  local input keys
  [ -t 0 ] && { input="${1:?Missing input JSON at index 1}"; shift; }
  [ -z "$input" ] && { input="$(cat)"; }

  keys="$(jqr 'keys' <<< "$input" | jqr '.[]')"
  while read -r key; do
    jsonGet ".$key" <<< "$input"
  done <<< "$keys"
}

# Adds all the elements piped to the method in an empty array.
# $1: excludes, an array of elements than can't be in the created array
jsonArrayize() {
  local input
  input="$(cat)"

  [ -z "$input" ] && { printf '[]'; return 0; }

  local excludes="${1:-[]}"
  local array='[]'

  local item
  while read -r item; do
    jsonContains "$item" <<< "$excludes" || { array="$(jsonSet '.' "$item" "string" <<< "$array")"; }
  done <<< "$input"
  printf "%s" "$array"
}

# Adds an element to the given JSON object at the given path.
# Uses: jq
# $1: The JSON object to update
# $2: The path to the element to add
# $3: The element to add
# $4: The type of the element to add to add quotes around strings (optional)
jsonSet() {
  local input container_type variable_type length
  if [ -t 0 ]; then
    if [ -z "$1" ]; then
      input="{}"
    else
      input="$1"
    fi
    shift
  else
    input="$(cat)"
  fi

  [ -z  "$input" ] && { echo "No input"; return 1; }

  local path="${1:?Missing \'path\' at index 1}"
  container_type="$(jqr "$path | type" <<< "${input:? Missing \'input\' at index 1}")"
  variable_type="$(readVar "unknown" "$3")"

  local variable_value="${2:? Missing \'value\' at index 2}"
  if [ "$variable_type" = "string" ]; then
    variable_value="\"$variable_value\""
  fi

  if [ "$container_type" = "array" ]; then
    length="$(jqr "$path | length" <<< "$input")"
    input="$(jqr "$path[$length] = $variable_value" <<< "$input")"
  else
    input="$(jqr "$path = $variable_value" <<< "$input")"
  fi
  echo "$input"
}


# Deletes the element at the given path from the given JSON object.
# Uses: jq
# $1: The JSON object to update
# $2: The path to the element to delete
jsonDelete() {
  echo "$1" | jq -c "del($2)"
}

# Determines if the given JSON object has an attribute at the given path.
# Returns 0 if true, 1 if false. In verbose mode, displays true or false.
# Uses: jq
# $1: The JSON object to check
# $2: The path to the element to check
# $3: Put -v here for verbose mode (optional)
jsonHas() {
  local input
  [ -t 0 ] && { input="${1:?Missing input JSON at index 1}"; shift; }
  [ -z "$input" ] && { input="$(cat)"; }
  local full_path="$1"

  local verbose="false"
  [ "$2" = "-v" ] && { verbose="true"; }

  local regex="^(.*?)(\.([^\.]+))$"
  [[ $full_path =~ $regex ]] || { echo "The path must follow the regex: $regex"; return 1; }
  local path=${BASH_REMATCH[1]}
  local lastKey=${BASH_REMATCH[3]}

  [ "$path" != "" ] && { input="$(jsonGet "$input" "$path" -r)"; }

  if isTrue "$(jqr "has(\"$lastKey\")" <<< "$input")"; then
    if isTrue "$verbose"; then
      echo "true"
    fi
  else
    isTrue "$verbose"  && { echo "false"; }
    return 1
  fi
}

# Gets the element at the given path from the given JSON object.
# Uses: jqr
# $1: The JSON object
# $2: The path to the element
jsonGet() {
  local input
  [ -t 0 ] && { input="${1:?Missing input JSON at index 1}"; shift; }
  [ -z "$input" ] && { input="$(cat)"; }
  local path="$1"

  if [ "$path" = "." ] || [ -z "$path" ]; then
    echo "$input"
    return 0
  fi

  echo "$input" | jqr "$path"
}

jsonContains() {
  local input
  [ -t 0 ] && { input="${1:?Missing input JSON at index 1}"; shift; }
  [ -z "$input" ] && { input="$(cat)"; }
  local value=${1?Missing value}

  local item
  while read -r item; do
    grepn -x -e "$value" <<< "$item" && { return 0; }
  done <<< "$(jqr '.[]' <<< "$input")"

  return 1
}

jsonSearch() {
  local input input_type
  if [ -t 0 ]; then
    if [ -z "$1" ]; then
      input="{}"
    else
      input="$1"
    fi
    shift
  else
    input="$(cat)"
  fi

  local key="$1"
  local value="$2"

  input_type="$(jqr 'type' <<< "$input")"
  if grepn -v -e "array" <<< "$input_type"; then
    echo "Cannot search a non-array, the input is of type '$input_type'"
    return 1
  fi

  echo "$input" | jqr '.[]' | jqr "select($key == $value)"

}
