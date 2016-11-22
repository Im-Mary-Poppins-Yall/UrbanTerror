#!/bin/bash

export SHUFFLED_MAP_FILE='q3ut4/mapcycle.txt'
export SERVER_CONFIG_FILE='q3ut4/server.cfg'
export UT_INSTALL_DIR_FILE='ut_install_dir.txt'
export UT_INSTALL_DIR DIR
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

test -f "$DIR/parameters.sh" && { . "$_"; }

main() {
  UT_INSTALL_DIR="$(tr -d '\n' < "$DIR/$UT_INSTALL_DIR_FILE")"
  [ -z "$UT_INSTALL_DIR" ] && {
    printf 'Could not find the UT installation directory, put it in file %s/%s\n' "$DIR" "$UT_INSTALL_DIR_FILE"
    return 1
  }

  [ -d "$UT_INSTALL_DIR" ] || {
    printf 'The UT installation directory provided in file %s/%s is not a folder\n' "$DIR" "$UT_INSTALL_DIR_FILE"
    return 1
  }

  local platform
  platform="$(uname)"

  pushd "$DIR" > /dev/null

  _shuffleMaps
  cp ./server.cfg "$UT_INSTALL_DIR/$SERVER_CONFIG_FILE"
  _tweakConfig "$(head -1 < "$UT_INSTALL_DIR/$SHUFFLED_MAP_FILE")" "$@"

  if grep "MINGW" <<< "$platform"; then
    "$UT_INSTALL_DIR/Quake3-UrT-Ded.exe" +exec server.cfg
  else
    "$UT_INSTALL_DIR/Quake3-UrT-Ded.x86_64" +exec server.cfg
  fi

  popd > /dev/null
}

_shuffleMaps() {
  local maps map
  maps="$(<"./built_in_maps.txt")"

  while read -r map; do
    map="${map/\.\//}"
    map="${map/\.pk3/}"
    maps="$(printf '%s\n%s' "$maps" "$map")"
  done <<< "$(cd "$UT_INSTALL_DIR/q3ut4"; find . -name 'ut4_*.pk3' -maxdepth 1)"

  printf '%s' "$maps" | shuf > "$UT_INSTALL_DIR/$SHUFFLED_MAP_FILE"
}

_tweakConfig() {
  local params mapSearchText
  local firstMap="$1"
  shift

  local paramsConfig='{"m": {"type": "string", "hasValue": true, "isRequired": false}}';
  params="$(setParams "$paramsConfig" "$@")"

  mapSearchText="$(jqr '.m' <<< "$params")"
  isNotNull "$mapSearchText" && {
    firstMap="$(grep "$mapSearchText" < "$UT_INSTALL_DIR/$SHUFFLED_MAP_FILE")" || {
      printf 'Cannot find a map by searching with "%s".\nAvailable maps:\n%s\n' "$mapSearchText" "$(sort < "$UT_INSTALL_DIR/$SHUFFLED_MAP_FILE")"
      return 1
    }
  }

  printf 'map %s\n' "$firstMap" >> "$UT_INSTALL_DIR/$SERVER_CONFIG_FILE"
}

main "$@"
