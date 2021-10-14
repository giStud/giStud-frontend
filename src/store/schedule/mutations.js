export function setSelectedGroup (state, group) {
    state.selectedGroup = group;
}

export function setGroupNames (state, names) {
  state.groupNames = names;
}

export function setUnivNames (state, names) {
  state.univNames = names;
}

export function addUnivName(state, univ) {
  state.univNames.push({univName : univ.name, city : univ.cityName, univId : univ.univId});
}

export function setFacNames (state, names) {
  state.facNames = names;
}

export function setLessonTypes (state, types) {
  state.lessonTypes = types;
}
