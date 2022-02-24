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

export function addFacultyName(state, faculty) {
  state.faculties.push({faculty : faculty.name, facId : faculty.facId});
}

export function setFaculties (state, names) {
  state.faculties = names;
}

export function setLessonTypes (state, types) {
  state.lessonTypes = types;
}
