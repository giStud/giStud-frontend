import {api} from "boot/axios"
import authHeader from "../auth/authHeader";

class FacultyService {
  async createFaculty(faculty) {
    const {data} = await api.post("/faculties",
      {university : faculty.univ, facName : faculty.name, scheduleLink : faculty.link},
      {headers: authHeader()});
    return data;
  }

  async getFacultiesByUniv(univId) {
    const {data} = await api.get("/faculties/filterByUniv/" + univId, {headers: authHeader()});
    console.log(data)
    return data;
  }
}

export default new FacultyService;
