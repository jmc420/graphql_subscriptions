

export type GraphQLResult = {
    error: string;
    json: any;
}

export async function postGraphQL(url: string, query: string, variables: any): Promise<GraphQLResult> {

	try {
		const headers: any = {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		};
		const response = await fetch(url, {
			method: "POST",
			headers: headers,
			body: JSON.stringify({ query, variables }),
		});

		if (response.ok) {
			const result: any = await response.json();

			if (result.errors) {
				const error = result.errors[0];

				return { error: error.message, json: "" };
			}
			else {
				return { error: "", json: result.data };
			}
		}
		else {
			return { error: response.statusText, json: "" };
		}
	}
	catch (e) {
		return { error: e.message, json: "" };
	}
}