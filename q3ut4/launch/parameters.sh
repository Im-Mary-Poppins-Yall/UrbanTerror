##############
# Parameters #
##############

test -f "$DIR/json.sh" && { . "$_"; }
test -f "$DIR/utils.sh" && { . "$_"; }

_checkRequiredParams() {
  local paramsConfig="$1"
  shift

  local keys
  keys="$(_getKeys "$paramsConfig")"
  while read -r key; do
    if isTrue "$(jsonGet ".$key.isRequired" <<< "$paramsConfig")" > /dev/null; then
      if grepn -v -e "-$key" <<< "$@"; then
        echo "Missing required parameter -$key"
        return 1
      fi
      echo "" > /dev/null
    fi
  done <<< "$keys"
}

_checkHasNoValue() {
  if isTrue "$(jsonGet "$1" ".$2.hasValue")"; then
    echo "Missing value for parameter -$2"
    return 1
  fi
}

_getKeysForGetOpts() {
  local paramsConfig="$1"
  shift

  local keys
  keys="$(_getKeys "$paramsConfig")"
  echo -ne ":"
  while read -r key; do
    echo -n "$key"
    if isTrue "$(jsonGet ".$key.hasValue" <<< "$paramsConfig")" > /dev/null; then
      echo -n ":"
    fi
  done <<< "$keys"
}

_getKeys() {
  jqr 'keys' <<< "$1" | jqr '.[]'
}

_initializeBooleanParams() {
  local paramsConfig="$1"
  local keys hasValue
  keys="$(_getKeys "$paramsConfig")"
  local params='{}'
  while read -r key; do
    hasValue="$(jsonGet ".$key.hasValue" <<< "$paramsConfig")"
    if isFalse "$hasValue"; then
      params="$(jsonSet ".$key" 'false' <<< "$params")"
    fi
  done <<< "$keys"
  echo "$params"
}

setParams() {
  local paramsConfig="$1"
  shift

  _checkRequiredParams "$paramsConfig" "$@" || { return 1; }
  local params keysForGetOpts optType optEnum
  params="$(_initializeBooleanParams "$paramsConfig")"
  keysForGetOpts="$(_getKeysForGetOpts "$paramsConfig")"

  OPTIND=1
  while getopts "$keysForGetOpts" opt; do
    if [[ "$opt" =~ [\?:]{1} ]]; then
      ((OPTIND--))
      echo "Missing value for parameter ${!OPTIND}"
      return 1
    else
      if [ -n "$OPTARG" ]; then
        optType="$(jqr ".$opt.type" <<< "$paramsConfig")"
        optEnum="$(jqr ".$opt.enum" <<< "$paramsConfig")"
        if _checkValue "$OPTARG" "$optType" "$optEnum" "$opt"; then
          params="$(jsonSet ".$opt" "$OPTARG" "$optType" <<< "$params")"
        else
          echo "Parameter -$opt must be of type $optType"
          return 1
        fi
      else
        _checkHasNoValue "$paramsConfig" "$opt" || { return 1; }
        params="$(jsonSet ".$opt" 'true' <<< "$params")"
      fi
    fi
  done

  echo "$params"
}

_checkValue() {
  local paramValue="$1"
  local paramType="$2"
  local paramEnum="$3"
  local paramName="$4"
  if [ "$paramType" = "int" ]; then
    if grepn -v -e "^[0-9][0-9]*$" <<< "$paramValue"; then
      echo "Parameter -$paramName must be of type $paramType"
      return 1
    fi
  fi

  if isNotNull "$paramEnum"; then
    jsonContains "$paramValue" <<< "$paramEnum" || { echo "Parameter -$paramName must be one of $paramEnum"; return 1; }
  fi
}
