

export interface IAppContext {

}

let appContext: IAppContext = null;

export async function getAppContext(): Promise<IAppContext> {
	if (appContext == null) {
		
		appContext = {};
	}
	return appContext;
}
