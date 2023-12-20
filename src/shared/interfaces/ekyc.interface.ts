import internal from "stream";
// "dob": "31-01-1987",
// "doe": "31-01-2027",
// "doi": "28-08-2019",
// "poi": "CỤC TRƯỞNG CỤC CẢNH SÁT QUẢN LÝ HÀNH CHÍNH VỀ TRẬT TỰ XÃ HỘI",
// "ethnicity": "N/A",
// "features": "Nốt Ruồi C 2Cm Trên Sau Đuôi Lông Mày Phải",
// "gender": "Nam",
// "home": "A Hiệp, Quỳnh Phụ, Thái Bình",
// "home_entities": null,
// "residence": "Nguyên Xá 2, An Hiệp, Quỳnh Phụ, Thái Bình",
// "residence_entities": {
//     "province": "Thái Bình",
//     "district": "Quỳnh Phụ",
//     "ward": "An Hiệp",
//     "street": "Nguyên Xá 2"
// },
// "id_number": "034087011260",
// "name": "NGUYỄN ĐỨC VINH",
// "religion": "N/A",
// "type": "CCCD",
// "session": "122-20220812113457-zW0bLBT"
export interface EkycData {
  dob: string, //ngay sinh
  doe: string, //ngay het han
  doi: string, // nay lam gttt
  poi: string,
  ethnicity: string,
  features: string,
  gender: string,
  home: string,
  home_entities:{
    province: string,
    district: string,
    ward: string,
    street: string
  },
  residence: string,
  residence_entities: {
    province: string,
    district: string,
    ward: string,
    street: string
  },
  id_number: string,
  name: string,
  religion: string,
  type: string,
  session?: string,
  front_image:{
    path: string,
    url: string
  },
  back_image: {
    path: string,
    url: string
  },
  selfie_image: {
    path: string,
    url: string
  },
  data?: string //chuoi json,
  desc?: string
}

