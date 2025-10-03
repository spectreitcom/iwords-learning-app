export type Box = {
  boxId: string;
  title: string;
  expressionContextIds: string[];
};

export type BoxItem = {
  expressionContextId: string;
  phrase: string;
  translation: string;
};

export type BoxDetails = {
  boxId: string;
  title: string;
  boxItems: BoxItem[];
};
