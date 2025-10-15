export abstract class VerifySignatureStrategy {
  abstract verify(): Promise<boolean>;
}
